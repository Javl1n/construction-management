<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DraftController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProjectPlanController;
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

    Route::prefix('drafts')->name('drafts.')->controller(DraftController::class)
        ->group(function () {
            Route::post('/', 'store')->name('store');
            Route::get('/export', 'export')->name('export');
            Route::post('/import', 'import')->name('import');
        });

    Route::name('projects.')->prefix('project')->controller(ProjectController::class)
        ->group(function () {
            // Route::get('/', 'show')->name('show');
            Route::post('/switch', 'switch')->name('switch');
            Route::post('/start', 'start')->name('start')->middleware('project');
            Route::post('/', 'store')->name('store');
        });

    Route::name('logs.')->prefix('items/{item}/logs')->controller(LogController::class)
        ->middleware('project')
        ->group(function () {
            Route::post('/', 'store')->name('store');
        });

    Route::name('plans.')->prefix('plans')->controller(ProjectPlanController::class)
        ->group(function () {
            Route::get('create', 'create')->name('create')->middleware('project');
            Route::post('/', 'store')->name('store')->middleware('project');
        });
});

require __DIR__ . '/settings.php';
