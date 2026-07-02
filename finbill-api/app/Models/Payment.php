<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\Traits\BelongsToCompany;

class Payment extends Model
{
    use HasFactory, BelongsToCompany;

    // This allows Laravel to save payment records into the database safely
    protected $fillable = [
        'company_id',
        'invoice_id', // Ensures the payment maps correctly to the parent invoice
        'amount_paid',
        'payment_date',
        'reference_id',
        'status'
    ];

     /**
     * Get the specific invoice invoice connected to this payment row entry node.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

}
