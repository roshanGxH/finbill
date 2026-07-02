<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Fetches top metrics for dashboard metrics
    public function stats()
{
    $companyId = auth()->user()->company_id;

    return response()->json([
        'total_clients' => Client::where('company_id', $companyId)->count(),
        'total_invoices' => Invoice::whereHas('client', fn($q) => $q->where('company_id', $companyId))->count(),
        'paid_invoices' => Invoice::where('status', 'paid')->whereHas('client', fn($q) => $q->where('company_id', $companyId))->count(),
        'overdue_invoices' => Invoice::where('status', 'overdue')->whereHas('client', fn($q) => $q->where('company_id', $companyId))->count(),
        'outstanding_balance' => (float) Client::where('company_id', $companyId)->sum('current_balance')
    ]);
}

    // Compiles monthly revenue charts matrix
    public function revenue()
{
    $companyId = auth()->user()->company_id;

    $revenue = DB::table('payments')
        ->join('invoices', 'payments.invoice_id', '=', 'invoices.id')
        ->join('clients', 'invoices.client_id', '=', 'clients.id')
        ->where('clients.company_id', $companyId)
        ->where('payments.status', 'active') // Only count active payments towards realized revenue
        ->select(
            DB::raw("EXTRACT(MONTH FROM payments.payment_date) as month_num"),
            DB::raw("to_char(payments.payment_date, 'Mon') as month"),
            DB::raw("SUM(payments.amount_paid) as revenue")
        )
        ->groupBy('month_num', 'month')
        ->orderBy('month_num')
        ->get()
        ->map(function ($item) {
            $item->revenue = (float) $item->revenue;
            return $item;
        });

    return response()->json($revenue);
}

}
