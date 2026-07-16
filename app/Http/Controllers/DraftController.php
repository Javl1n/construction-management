<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDraftRequest;
use App\Http\Requests\UpdateDraftRequest;
use App\Models\Draft;
use App\Models\Project;
use Illuminate\Http\Request;

class DraftController extends Controller
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDraftRequest $request)
    {
        $project = Project::find(session('current_project_id'));

        $project->draft()->updateOrCreate([], [
            'data' => $request->all()
        ]);

        return back();
    }

    public function export()
    {
        $project = Project::find(session('current_project_id'));

        return response()->streamDownload(function () use ($project) {
            echo json_encode($project->draft->data, JSON_PRETTY_PRINT);
        }, 'data.json', ['Content-Type' => 'application/json']);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file'],
        ]);

        $data = json_decode($request->file('file')->get(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['message' => 'Invalid JSON file.'], 422);
        }

        $project = Project::find(session('current_project_id'));

        $project->draft()->updateOrCreate([], [
            'data' => $data
        ]);

        return response()->json(['message' => 'Draft imported.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Draft $draft)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Draft $draft)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDraftRequest $request, Draft $draft)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Draft $draft)
    {
        //
    }
}
