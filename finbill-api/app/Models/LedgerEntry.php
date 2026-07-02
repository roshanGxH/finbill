<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LedgerEntry extends Model
{
    use HasFactory;

    // This allows Laravel to safely write accounting double-entry rows into the database
    protected $fillable = [
        'client_id',
        'invoice_id',
        'type',
        'amount',
        'description'
    ];
}
