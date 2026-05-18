<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\WorkerController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::inertia('empty-project', 'empty-project')->name('empty-project');

    Route::name('projects.')->prefix('project')->controller(ProjectController::class)
        ->group(function () {
            // Route::get('/', 'show')->name('show');
            Route::post('/switch', 'switch')->name('switch');
            Route::post('/', 'store')->name('store');
        });

    Route::name('items.')->prefix('items')->controller(ItemController::class)
        ->group(function () {
            Route::get('create', 'create')->name('create')->middleware('project');
        });
});

require __DIR__ . '/settings.php';
