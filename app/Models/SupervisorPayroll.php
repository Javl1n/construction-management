<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['role', 'cost', 'paid_at'])]
class SupervisorPayroll extends Model
{
    /** @use HasFactory<\Database\Factories\SupervisorPayrollFactory> */
    use HasFactory;
}
