<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VoidRequest;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class VoidRequestController extends Controller
{
    /**
     * Display a listing of void requests.
     */
    public function index()
    {
        $requests = VoidRequest::with(['payment.invoice.client', 'user'])
            ->latest()
            ->get();

        return response()->json($requests);
    }

    /**
     * File a new void request ticket.
     */
    public function store(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'reason' => 'required|string|max:500'
        ]);

        $payment = Payment::findOrFail($request->payment_id);

        $status = $payment->status ?? 'active';
        if ($status !== 'active') {
            return response()->json(['message' => 'This payment is already voided or pending void review.'], 422);
        }

        DB::beginTransaction();

        try {
            // 1. Create Void Request Ticket
            $voidRequest = VoidRequest::create([
                'company_id' => auth()->user()->company_id,
                'user_id' => auth()->id(),
                'payment_id' => $payment->id,
                'reason' => $request->reason,
                'status' => 'pending'
            ]);

            // 2. Lock payment to void_pending status
            $payment->update(['status' => 'void_pending']);

            DB::commit();

            return response()->json([
                'message' => 'Void ticket request filed successfully.',
                'ticket' => $voidRequest
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Void request submission failed: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred while submitting the ticket.'], 500);
        }
    }

    /**
     * Approve a pending void request ticket.
     */
    public function approve(VoidRequest $voidRequest)
    {
        if ($voidRequest->status !== 'pending') {
            return response()->json(['message' => 'This ticket has already been resolved.'], 422);
        }

        DB::beginTransaction();

        try {
            $payment = $voidRequest->payment;
            $invoice = $payment->invoice;

            // 1. Revert client balance (add money back since payment is voided)
            $invoice->client->increment('current_balance', $payment->amount_paid);

            // 2. Remove matching LedgerEntry (credit entry)
            \App\Models\LedgerEntry::where('client_id', $invoice->client_id)
                ->where('invoice_id', $invoice->id)
                ->where('type', 'credit')
                ->where('amount', $payment->amount_paid)
                ->latest()
                ->first()
                ?->delete();

            // 3. Mark payment as voided
            $payment->update(['status' => 'voided']);

            // 4. Recalculate invoice status based on remaining active payments
            $totalPaid = $invoice->payments()->where('status', 'active')->sum('amount_paid');
            if ($totalPaid >= $invoice->total_amount) {
                $invoice->update(['status' => 'paid']);
            } else {
                $status = \Carbon\Carbon::parse($invoice->due_date)->isPast() ? 'overdue' : 'unpaid';
                $invoice->update(['status' => $status]);
            }

            // 5. Update ticket status to approved
            $voidRequest->update(['status' => 'approved']);

            // 6. Write Activity Log
            \App\Models\ActivityLog::create([
                'company_id' => auth()->user()->company_id,
                'user_id' => auth()->id(),
                'action' => 'payment_void_approved',
                'entity_type' => 'payment',
                'entity_id' => $payment->id
            ]);

            DB::commit();

            return response()->json(['message' => 'Void request approved successfully. Payment rolled back.']);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Void request approval failed: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred during approval.'], 500);
        }
    }

    /**
     * Reject a pending void request ticket.
     */
    public function reject(VoidRequest $voidRequest)
    {
        if ($voidRequest->status !== 'pending') {
            return response()->json(['message' => 'This ticket has already been resolved.'], 422);
        }

        DB::beginTransaction();

        try {
            // 1. Restore payment to active status
            $voidRequest->payment->update(['status' => 'active']);

            // 2. Update ticket status to rejected
            $voidRequest->update(['status' => 'rejected']);

            DB::commit();

            return response()->json(['message' => 'Void request rejected. Payment status restored.']);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Void request rejection failed: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred during rejection.'], 500);
        }
    }
}
