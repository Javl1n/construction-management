<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['log_id', 'role', 'quantity'])]
class WorkerLog extends Model
{
    protected $table = 'worker_logs';

    public function log(): BelongsTo
    {
        return $this->belongsTo(ItemLog::class, 'log_id');
    }
}
