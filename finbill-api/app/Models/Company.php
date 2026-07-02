<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    // This allows Laravel to save these fields into the database safely
    protected $fillable = [
        'name',
        'tax_id',
        'currency'
    ];

    // Defines the relationship: One company can have many users
    public function users()
    {
        return $this->hasMany(User::class);
    }
}