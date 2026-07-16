<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date'                   => ['required', 'date'],
            'quantity'               => ['required', 'numeric', 'min:0.001'],
            'worker_logs'            => ['required', 'array', 'min:1'],
            'worker_logs.*.role'     => ['required', 'string', 'max:255'],
            'worker_logs.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
