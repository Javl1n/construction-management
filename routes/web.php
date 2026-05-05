<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::name('admin.')->prefix('admin')->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
    });

    Route::inertia('empty-project', 'empty-project')->name('empty-project');
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('role:engineer')->group(function () {
        Route::name('projects.')->prefix('project')->controller(ProjectController::class)
            ->group(function () {
                Route::get('/', 'show')->name('show');
                Route::post('/switch', 'switch')->name('switch');
                Route::post('/', 'store')->name('store');
            });

        // Route::name('workers.')->prefix('workers')->
    });
});

require __DIR__ . '/settings.php';
