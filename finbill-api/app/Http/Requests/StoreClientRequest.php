<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Set to true
    }

    public function rules(): array
    {
        return [
            'client_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
        ];
    }
}
