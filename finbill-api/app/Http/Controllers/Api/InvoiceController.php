<?php

namespace App\Http\Controllers\Api;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\ActivityLog; // Model imported correctly
use App\Http\Requests\StoreInvoiceRequest;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    // List multi-tenant invoices
    public function index()
    {
        $invoices = Invoice::with(['client', 'items'])
            ->latest()
            ->get();

        return response()->json($invoices);
    }

    // Create Invoice with atomic database transaction
    public function store(StoreInvoiceRequest $request)
    {
        DB::beginTransaction();

        try {
            $client = Client::findOrFail($request->client_id);

            $grandTotal = 0;
            foreach ($request->items as $item) {
                $grandTotal += $item['quantity'] * $item['unit_price'];
            }

            // 1. First, create the Invoice entry
            $invoice = Invoice::create([
                'client_id' => $client->id,
                'invoice_number' => 'INV-' . time(),
                'total_amount' => $grandTotal,
                'due_date' => $request->due_date,
                'status' => 'unpaid'
            ]);

            // 2. Next, create the child items entries
            foreach ($request->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $item['quantity'] * $item['unit_price']
                ]);
            }

            // 3. Auto-update client accounting balance ledger limits
            $client->increment('current_balance', $grandTotal);

            // 4. Create Initial Accounting Debit Entry
            \App\Models\LedgerEntry::create([
                'client_id' => $client->id,
                'invoice_id' => $invoice->id,
                'type' => 'debit',
                'amount' => $grandTotal,
                'description' => 'Invoice Generated'
            ]);

            // 5. Create Audit Activity Log Trace (Placed after $invoice is created)
            ActivityLog::create([
                'company_id' => auth()->user()->company_id,
                'user_id' => auth()->id(),
                'action' => 'invoice_created',
                'entity_type' => 'invoice',
                'entity_id' => $invoice->id
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Invoice created successfully',
                'invoice' => $invoice->load('items')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Invoice creation failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);

            return response()->json([
                'message' => 'An error occurred while creating the invoice. Please try again.'
            ], 500);
        }
    }    // Generates and handles streaming production secure PDF exports
    public function downloadPdf(Invoice $invoice)
    {
        // Multi-tenant barrier check
        if ($invoice->client->company_id !== auth()->user()->company_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Lazy load explicit context relationships to prevent N+1 overhead queries
        $invoice->load(['client', 'items']);

        // Feed data blueprint into DOMPDF layout compiler 
        $pdf = Pdf::loadView('pdf.invoice', compact('invoice'));

        // Streams automated binary response file attachment
        return $pdf->download("invoice-{$invoice->invoice_number}.pdf");
    }
    public function destroy(Invoice $invoice)
{
    if ($invoice->client->company_id !== auth()->user()->company_id) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    DB::transaction(function () use ($invoice) {
        // Decrement client balance as the invoice is being removed
        if ($invoice->status !== 'paid') {
            $invoice->client->decrement('current_balance', $invoice->total_amount);
        }
        $invoice->delete(); // This cascades deletion to invoice_items automatically due to migration rules
    });

    return response()->json(['message' => 'Invoice deleted successfully']);
}


}
