<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    // MUST BE TRUE to allow users to post payments
    public function authorize(): bool
    {
        return true; 
    }

    // Validation rules for checking incoming fintech client payments
    public function rules(): array
    {
        return [
            'invoice_id' => 'required|exists:invoices,id',
            'amount_paid' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'reference_id' => 'required|string|max:255'
        ];
    }
}
