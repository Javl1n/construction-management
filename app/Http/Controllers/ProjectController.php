<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected function index()
    {
        /** @var \Illuminate\Auth\SessionGuard $auth **/
        $auth = auth();

        return $auth->user()->projects;
    }

    public function switch(Request $request)
    {
        $projectId = $request->input('project_id');

        $project = $request->user()->projects()->findOrFail($projectId);

        session(['current_project_id' => $project->id]);

        return back();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();
        $project = $request->user()->projects()->create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return inertia('dashboard');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
