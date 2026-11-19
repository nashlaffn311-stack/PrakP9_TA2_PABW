<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Armada\Models\Armada;
use Modules\Rute\Models\Rute;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'totalRute' => Rute::count(),
            'totalArmada' => Armada::count(),
            'totalUsers' => User::count(),
            'recentRutes' => Rute::latest()->take(5)->get(),
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';