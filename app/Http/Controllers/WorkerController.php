<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkerRequest;
use App\Http\Requests\UpdateWorkerRequest;
use App\Models\Worker;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dd($request->user()->workers);
        return inertia('workers/index', [
            "workers" => $request->user()->workers
        ]);
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
    public function store(StoreWorkerRequest $request)
    {
        $validated = $request->validated();

        $worker = $request->user()->workers()->create($validated);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Worker $worker)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Worker $worker)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkerRequest $request, Worker $worker)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Worker $worker)
    {
        //
    }
}
