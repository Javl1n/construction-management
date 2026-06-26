<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectPlanRequest;
use App\Models\Material;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
        dd($request->all());
        return back();
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
