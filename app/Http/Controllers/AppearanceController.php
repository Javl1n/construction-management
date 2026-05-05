<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppearanceController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $isAdmin = $request->user()->isRole('admin');
        return inertia($isAdmin ? 'admin/settings/appearance' : 'settings/appearance');
    }
}
