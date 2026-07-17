<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $projectId = session('current_project_id');

        if (!$projectId) {
            $project = $request->user()->projects()->latest()->first();
            if ($project) {
                session(['current_project_id' => $project->id]);
                $projectId = $project->id;
            }
        }

        if (!$projectId) {
            return inertia()->render('dashboard');
        }

        $project = Project::with([
            'items.workers',
            'items.equipment',
            'items.materials',
            'items.prerequisites',
            'items.logs.workerLogs',
            'purchases.materials',
        ])->find($projectId);

        if (!$project) {
            return inertia()->render('dashboard');
        }

        if ($project->items->isEmpty()) {
            return redirect()->route('plans.create');
        }

        // Working days elapsed = number of distinct dates that have at least one log entry
        $daysElapsed = $project->date_started
            ? $project->items
                ->flatMap(fn($item) => $item->logs->pluck('date'))
                ->unique()
                ->count()
            : null;

        // Project-level planned progress
        $plannedPct = ($daysElapsed !== null && $project->planned_days)
            ? min(round(($daysElapsed / $project->planned_days) * 100, 1), 100.0)
            : null;

        // Compute each item's scheduled start day via topological sort (mirrors usePrerequisiteOrder)
        $itemMap = $project->items->keyBy('id');
        $startDays = [];

        $getStartDay = function (int $itemId) use (&$getStartDay, $itemMap, &$startDays): int {
            if (array_key_exists($itemId, $startDays)) {
                return $startDays[$itemId];
            }
            $item = $itemMap[$itemId];
            $maxEnd = 0;
            foreach ($item->prerequisites as $prereq) {
                $maxEnd = max($maxEnd, $getStartDay($prereq->id) + $prereq->days);
            }
            return $startDays[$itemId] = $maxEnd;
        };

        foreach ($project->items as $item) {
            $getStartDay($item->id);
        }

        // Progress stats (quantity-weighted)
        $totalItems = $project->items->count();
        $totalQuantity = $project->items->sum('quantity');

        // Build a quantity_done lookup for actual progress
        $quantityDoneMap = $project->items->mapWithKeys(fn($item) => [
            $item->id => min(
                $item->logs->sortByDesc('date')->first()?->quantity ?? 0,
                $item->quantity
            ),
        ]);

        $completedQuantity = $quantityDoneMap->sum();
        $completionPct = $totalQuantity > 0
            ? round(($completedQuantity / $totalQuantity) * 100, 1)
            : 0;

        // Cost calculations
        $totalLaborCost = 0;
        $totalEquipmentCost = 0;
        $totalMaterialCost = 0;

        $itemsData = $project->items->map(function ($item) use (&$totalLaborCost, &$totalEquipmentCost, &$totalMaterialCost, $quantityDoneMap, $startDays, $daysElapsed) {
            $laborCost = $item->workers->sum(fn($w) => $w->quantity * $w->rate * $item->days);
            $equipmentCost = $item->equipment->sum(fn($e) => $e->quantity * $e->rate * $item->days);
            $materialCost = $item->materials->sum(fn($m) => $m->pivot->quantity * $m->price);

            $totalLaborCost += $laborCost;
            $totalEquipmentCost += $equipmentCost;
            $totalMaterialCost += $materialCost;

            $blockedBy = $item->prerequisites->first(
                fn($prereq) => ($quantityDoneMap[$prereq->id] ?? 0) < $prereq->quantity
            );

            // Planned quantity for this item based on schedule position and days elapsed
            $plannedQuantityDone = null;
            if ($daysElapsed !== null) {
                $itemStart = $startDays[$item->id];
                $itemEnd   = $itemStart + $item->days;

                $plannedQuantityDone = match (true) {
                    $daysElapsed <= $itemStart => 0.0,
                    $daysElapsed >= $itemEnd   => (float) $item->quantity,
                    default                    => round(
                        (($daysElapsed - $itemStart) / $item->days) * $item->quantity,
                        2
                    ),
                };
            }

            return [
                'id'                   => $item->id,
                'name'                 => $item->name,
                'icon'                 => $item->icon,
                'days'                 => $item->days,
                'quantity'             => $item->quantity,
                'unit'                 => $item->unit,
                'quantity_done'        => $quantityDoneMap[$item->id],
                'planned_quantity_done'=> $plannedQuantityDone,
                'cost'                 => $laborCost + $equipmentCost + $materialCost,
                'prerequisites'        => $item->prerequisites->pluck('id')->toArray(),
                'blocked_by'           => $blockedBy?->name,
                'log_days'             => $item->logs->pluck('date')->unique()->count(),
                'workers'              => $item->workers->map(fn($w) => [
                    'id'       => $w->id,
                    'role'     => $w->role,
                    'quantity' => $w->quantity,
                    'rate'     => $w->rate,
                ]),
            ];
        });

        $totalEstimatedCost = $totalLaborCost + $totalEquipmentCost + $totalMaterialCost;

        $totalPurchased = $project->purchases->sum(fn($purchase) =>
            $purchase->materials->sum(fn($m) => $m->pivot->quantity * $m->pivot->price)
        );

        $purchasesData = $project->purchases
            ->sortByDesc('purchased_at')
            ->map(fn($purchase) => [
                'id'           => $purchase->id,
                'purchased_at' => $purchase->purchased_at,
                'total'        => $purchase->materials->sum(fn($m) => $m->pivot->quantity * $m->pivot->price),
                'items_count'  => $purchase->materials->count(),
            ])
            ->values();

        $logsData = $project->items
            ->flatMap(fn($item) => $item->logs->map(fn($log) => [
                'id'        => $log->id,
                'date'      => $log->date->toDateString(),
                'item_name' => $item->name,
                'item_icon' => $item->icon,
                'quantity'  => $log->quantity,
                'unit'      => $item->unit,
                'workers'   => $log->workerLogs->map(fn($w) => [
                    'role'     => $w->role,
                    'quantity' => $w->quantity,
                ])->values(),
            ]))
            ->sortByDesc('date')
            ->values();

        return inertia()->render('dashboard', [
            'stats' => [
                'completion_pct'       => $completionPct,
                'planned_pct'          => $plannedPct,
                'total_quantity'       => $totalQuantity,
                'completed_quantity'   => $completedQuantity,
                'total_items'          => $totalItems,
                'planned_days'         => $project->planned_days,
                'days_elapsed'         => $daysElapsed,
                'total_estimated_cost' => $totalEstimatedCost,
                'total_purchased'      => $totalPurchased,
            ],
            'items'          => $itemsData,
            'purchases'      => $purchasesData,
            'logs'           => $logsData,
            'cost_breakdown' => [
                'labor'     => $totalLaborCost,
                'equipment' => $totalEquipmentCost,
                'materials' => $totalMaterialCost,
            ],
        ]);
    }
}
