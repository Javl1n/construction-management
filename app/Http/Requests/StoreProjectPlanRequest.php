<?php

namespace App\Http\Requests;

use App\Models\Project;
use App\Rules\ValidPrerequisite;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectPlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Project::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $items = $this->input('items', []);
        $rules = [
            'name' => [
                'required',
                'string',
                Rule::unique('projects')->where(
                    fn($query) => $query->where('user_id', $this->user()->id)
                )->ignore(session('current_project_id'))
            ],
            'icon' => [
                'required',
                'string',
            ],
            "engineer" => [
                "required",
                Rule::exists('users', 'id')->whereNot('role', 'encoder')
            ],
            "planned_days" => [
                "required",
                "integer"
            ],

            "items" => ["required", "array"],
            "items.*.name" => ["required", "string", "distinct"],
            "items.*.id" => ["required", "integer", "distinct"],
            "items.*.icon" => ["required", "string", "distinct"],
            "items.*.planned_days" => ["required", "integer"],
            "items.*.quantity" => ["required", "numeric"],
            "items.*.unit" => ["required", "string"],

            "items.*.materials" => ["required", "array"],
            "items.*.materials.*.name" => ["required", "string",],
            "items.*.materials.*.unit" => ["required", "string"],
            "items.*.materials.*.quantity" => ["required", "integer"],
            "items.*.materials.*.price" => ["required", "numeric"],

            "items.*.laborers" => ["required", "array"],
            "items.*.laborers.*.role" => ["required", "string"],
            "items.*.laborers.*.quantity" => ["required", "integer"],
            "items.*.laborers.*.rate" => ["required", "numeric"],

            "items.*.prerequisites" => ["nullable", "array"],
            "items.*.prerequisites.*" => ["integer"],

            "items.*.equipment" => ["nullable", "array"],
            "items.*.equipment.*.name" => ["required", "string"],
            "items.*.equipment.*.quantity" => ["required", "integer"],
            "items.*.equipment.*.rate" => ["required", "numeric"],
        ];

        foreach ($items as $index => $item) {
            $rules["items.$index.prerequisites"] = [
                "nullable",
                "array",
                new ValidPrerequisite($items, $index)
            ];
        }

        return $rules;
    }
}
