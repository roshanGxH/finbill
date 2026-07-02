<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\BelongsToCompany;

class VoidRequest extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'user_id',
        'payment_id',
        'reason',
        'status'
    ];

    /**
     * Get the payment targeted by this void request.
     */
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Get the user who filed this ticket.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
