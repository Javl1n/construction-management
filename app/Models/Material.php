<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'unit', 'price'])]
class Material extends Model
{
    /** @use HasFactory<\Database\Factories\MaterialFactory> */
    use HasFactory;

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class);
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class)
            ->withPivot('quantity');
    }

    public function purchases(): BelongsToMany
    {
        return $this->belongsToMany(Purchase::class)
            ->withPivot('quantity', 'price');
    }
}
