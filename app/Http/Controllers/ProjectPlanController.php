<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectPlanRequest;
use App\Models\Material;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $engineers = User::whereNot('role', 'encoder')->get();
        $materials = Material::all();
        $project = Project::with(['draft'])->find(session('current_project_id'));

        return inertia()->render('plans/create', [
            'draft' => $project->draft?->data,
            'materials' => $materials,
            'engineers' => $engineers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectPlanRequest $request)
    {
        $validated = $request->validated();
        $project = Project::findOrFail(session('current_project_id'));

        DB::transaction(function () use ($validated, $project) {
            $project->update([
                'name' => $validated['name'],
                'icon' => $validated['icon'],
                'user_id' => $validated['engineer'],
                'planned_days' => $validated['planned_days'],
            ]);

            // Items reference each other's prerequisites by the client-side
            // draft id, not a real primary key, so create them all first and
            // resolve prerequisite ids afterwards.
            $items = [];

            foreach ($validated['items'] as $itemValidated) {
                $item = $project->items()->create([
                    'name' => $itemValidated['name'],
                    'icon' => $itemValidated['icon'],
                    'quantity' => $itemValidated['quantity'],
                    'unit' => $itemValidated['unit'],
                    'days' => $itemValidated['planned_days'],
                ]);

                $items[$itemValidated['id']] = $item;

                foreach ($itemValidated['materials'] as $materialValidated) {
                    $material = Material::firstOrCreate([
                        'name' => $materialValidated['name'],
                    ], [
                        'unit' => $materialValidated['unit'],
                        'price' => $materialValidated['price'],
                    ]);

                    $item->materials()->attach($material->id, [
                        'quantity' => $materialValidated['quantity']
                    ]);
                }

                foreach ($itemValidated['laborers'] as $laborerValidated) {
                    $item->workers()->create($laborerValidated);
                }

                foreach ($itemValidated['equipment'] ?? [] as $equipmentValidated) {
                    $item->equipment()->create($equipmentValidated);
                }
            }

            foreach ($validated['items'] as $itemValidated) {
                $prerequisiteIds = collect($itemValidated['prerequisites'] ?? [])
                    ->map(fn($draftId) => $items[$draftId]->id)
                    ->all();

                if (!empty($prerequisiteIds)) {
                    $items[$itemValidated['id']]->prerequisites()->attach($prerequisiteIds);
                }
            }
        });

        return to_route('dashboard');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
