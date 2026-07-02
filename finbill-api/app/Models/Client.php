<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\Traits\BelongsToCompany;

class Client extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'client_name',
        'email',
        'current_balance'
    ];

    // Local Scope for Multi-Tenant Filtering
    public function scopeForCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    // Every client belongs to a single company
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
