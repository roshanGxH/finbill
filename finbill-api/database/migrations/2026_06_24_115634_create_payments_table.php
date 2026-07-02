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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            
            // Multi-tenant isolation boundary constraint
            $table->foreignId('company_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Relational target invoice connection link
            $table->foreignId('invoice_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->decimal('amount_paid', 15, 2);
            $table->date('payment_date');
            $table->string('reference_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
