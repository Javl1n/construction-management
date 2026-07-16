<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Worker;

#[Fillable(['name', 'icon', 'quantity', 'unit', 'days'])]
class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class)
            ->withPivot('quantity');
    }

    public function prerequisites(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'prerequisites', 'item_id', 'prerequisite_id');
    }

    public function dependents(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'prerequisites', 'prerequisite_id', 'item_id');
    }

    public function workers(): HasMany
    {
        return $this->hasMany(Worker::class);
    }

    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ItemLog::class);
    }
}
