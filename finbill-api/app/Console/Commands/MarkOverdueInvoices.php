<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use Carbon\Carbon;

class MarkOverdueInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:mark-overdue-invoices';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Scan for unpaid invoices that are past their due dates and mark them overdue';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Invoice::where('status', 'unpaid')
            ->where('due_date', '<', Carbon::today())
            ->update(['status' => 'overdue']);

        $this->info("Successfully marked {$count} invoices as overdue.");
    }
}
