<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeatherRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'city'  => 'sometimes|string|max:100',
            'units' => 'sometimes|in:standard,metric,imperial',
        ];
    }

    public function authorize(): bool
    {
        return true; // open access
    }
}
