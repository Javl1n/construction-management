<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['item_id', 'date', 'quantity'])]
class ItemLog extends Model
{
    protected $table = 'logs';

    protected $casts = [
        'date'     => 'date',
        'quantity' => 'float',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function workerLogs(): HasMany
    {
        return $this->hasMany(WorkerLog::class, 'log_id');
    }
}
