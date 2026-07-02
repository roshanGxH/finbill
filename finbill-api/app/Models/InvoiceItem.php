<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvoiceItem extends Model
{
    use HasFactory;

    // This allows Laravel to save invoice line items into the database safely
    protected $fillable = [
        'invoice_id', // Ensures the line items map correctly to the parent invoice
        'description',
        'quantity',
        'unit_price',
        'line_total'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
