<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    
    // Foreign key linked to clients table
    $table->foreignId('client_id')
          ->constrained()
          ->cascadeOnDelete();

    $table->string('invoice_number')->unique();
    $table->decimal('total_amount', 12, 2);
    $table->date('due_date');
    $table->enum('status', ['unpaid', 'paid', 'overdue'])->default('unpaid');
    
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
