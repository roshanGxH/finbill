<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\LedgerEntry;
use App\Http\Requests\StorePaymentRequest;
use Illuminate\Support\Facades\DB;
use App\Models\ActivityLog;

class PaymentController extends Controller
{
    /**
     * Display a listing of recorded payments for the active multi-tenant company workspace.
     */
    public function index()
    {
        // Handshake with invoices and client details dynamically under strict isolation barriers
        $payments = Payment::where('company_id', auth()->user()->company_id)
            ->with(['invoice.client'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($payments);
    }

    /**
     * Record a new financial settlement transaction block inside atomic database steps.
     */
    public function store(StorePaymentRequest $request)
    {
        DB::beginTransaction();

        try {
            // Load invoice along with the linked client context
            $invoice = Invoice::with('client')->findOrFail($request->invoice_id);

            // Multi-tenant check isolation barrier
            if ($invoice->client->company_id !== auth()->user()->company_id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            // 1. Create Payment Record entry
            $payment = Payment::create([
                'company_id' => auth()->user()->company_id, // Fixed multi-tenant key tracking injection
                'invoice_id' => $invoice->id,
                'amount_paid' => $request->amount_paid,
                'payment_date' => $request->payment_date,
                'reference_id' => $request->reference_id
            ]);

            // 2. Reduce the client accounting current balance
            $invoice->client->decrement('current_balance', $request->amount_paid);

            // 3. Create Accounting Credit Entry
            LedgerEntry::create([
                'client_id' => $invoice->client->id,
                'invoice_id' => $invoice->id,
                'type' => 'credit',
                'amount' => $request->amount_paid,
                'description' => 'Payment Received'
            ]);

            // Calculate total accumulated payments on this invoice
            $paidAmount = $invoice->payments()->sum('amount_paid');

            // 4. Production Invoicing Status Updates (Bypassing database check constraints)
            if ($paidAmount >= $invoice->total_amount) {
                $invoice->update(['status' => 'paid']);
            } else {
                $invoice->update(['status' => 'unpaid']);
            }

            // Create Audit Activity Log Trace
            \App\Models\ActivityLog::create([
                'company_id' => auth()->user()->company_id,
                'user_id' => auth()->id(),
                'action' => 'payment_received',
                'entity_type' => 'payment',
                'entity_id' => $payment->id
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Payment recorded successfully',
                'payment' => $payment
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Payment recording failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return response()->json(['message' => 'An error occurred while recording the payment. Please try again.'], 500);
        }
    }

    /**
     * Roll back a payment settlement inside a database transaction.
     */
    public function destroy(Payment $payment)
    {
        if ($payment->company_id !== auth()->user()->company_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        DB::beginTransaction();

        try {
            $invoice = $payment->invoice;

            // 1. Roll back the client's ledger balance (add the money back)
            $invoice->client->increment('current_balance', $payment->amount_paid);

            // 2. Delete the associated LedgerEntry
            LedgerEntry::where('client_id', $invoice->client_id)
                ->where('invoice_id', $invoice->id)
                ->where('type', 'credit')
                ->where('amount', $payment->amount_paid)
                ->latest()
                ->first()
                ?->delete();

            // 3. Delete the payment record itself
            $payment->delete();

            // 4. Recalculate invoice status
            $totalPaid = $invoice->payments()->sum('amount_paid');
            if ($totalPaid >= $invoice->total_amount) {
                $invoice->update(['status' => 'paid']);
            } else {
                $status = \Carbon\Carbon::parse($invoice->due_date)->isPast() ? 'overdue' : 'unpaid';
                $invoice->update(['status' => $status]);
            }

            // 5. Create Audit Activity Log
            ActivityLog::create([
                'company_id' => auth()->user()->company_id,
                'user_id' => auth()->id(),
                'action' => 'payment_deleted',
                'entity_type' => 'payment',
                'entity_id' => $payment->id
            ]);

            DB::commit();

            return response()->json(['message' => 'Payment rolled back successfully.']);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Payment deletion failed: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json(['message' => 'An error occurred while deleting the payment.'], 500);
        }
    }
}
