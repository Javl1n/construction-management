<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class ValidPrerequisite implements ValidationRule
{
    public function __construct(
        private array $items,
        private int $index
    ) {}
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $validIds = collect($this->items)->pluck('id')->filter()->all();
        $ownId = $this->items[$this->index]['id'] ?? null;

        foreach ($value as $prerequisiteId) {
            if ($prerequisiteId === $ownId) {
                $fail("An item cannot have itself as a prerequisite.", null);
                return;
            }
            if (!in_array($prerequisiteId, $validIds)) {
                $fail("The $attribute contains an invalid prerequisite ID: $prerequisiteId", null);
                return;
            }
        }
    }
}
