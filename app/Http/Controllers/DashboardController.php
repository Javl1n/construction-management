<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $project = $request->user()->projects()->latest()->first();


        if ($project && !session()->has('current_project_id')) {
            session(['current_project_id' => $project->id]);
        }

        return inertia()->render('dashboard');
    }
}
