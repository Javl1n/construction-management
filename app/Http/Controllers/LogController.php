<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLogRequest;
use App\Models\Item;
use Illuminate\Support\Facades\DB;

class LogController extends Controller
{
    public function store(StoreLogRequest $request, Item $item)
    {
        abort_unless($item->project_id === session('current_project_id'), 403);

        $item->load('prerequisites.logs');

        $unfinished = $item->prerequisites->first(function ($prereq) {
            $done = $prereq->logs->sortByDesc('date')->first()?->quantity ?? 0;
            return $done < $prereq->quantity;
        });

        if ($unfinished) {
            return back()->withErrors(['quantity' => "Cannot log progress: prerequisite \"{$unfinished->name}\" is not finished yet."]);
        }

        $validated = $request->validated();

        $lastQuantity = $item->logs()->orderByDesc('date')->value('quantity') ?? 0;

        if ($validated['quantity'] < $lastQuantity) {
            return back()->withErrors(['quantity' => "Progress cannot decrease below the previous log ({$lastQuantity})."]);
        }

        abort_if($validated['quantity'] > $item->quantity, 422);

        DB::transaction(function () use ($item, $validated) {
            $log = $item->logs()->create([
                'date'     => $validated['date'],
                'quantity' => $validated['quantity'],
            ]);

            foreach ($validated['worker_logs'] as $row) {
                $log->workerLogs()->create($row);
            }
        });

        return back();
    }
}
