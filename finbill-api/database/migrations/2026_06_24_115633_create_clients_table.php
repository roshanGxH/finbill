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
        Schema::create('clients', function (Blueprint $table) {
    $table->id();
    
    // Links this client to a specific company (Multi-Tenant Core)
    $table->foreignId('company_id')
          ->constrained()
          ->cascadeOnDelete();

    $table->string('client_name');
    $table->string('email')->nullable();
    
    // Decimal field for maintaining accounting ledger limits safely
    $table->decimal('current_balance', 12, 2)->default(0.00);
    
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
