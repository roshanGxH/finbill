<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::addGlobalScope('company_scope', function ($builder) {
            if (auth()->check()) {
                $builder->whereHas('client', function ($query) {
                    $query->where('company_id', auth()->user()->company_id);
                });
            }
        });
    }

    protected $fillable = [
        'client_id',
        'invoice_number',
        'total_amount',
        'due_date',
        'status'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // Add this missing relationship function to fix the error
    // Add this missing relationship function to fix the error
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
