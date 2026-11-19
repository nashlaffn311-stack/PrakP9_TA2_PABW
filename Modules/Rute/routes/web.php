<?php

use Illuminate\Support\Facades\Route;
use Modules\Rute\Http\Controllers\RuteController;

Route::middleware(['auth'])->group(function () {
    Route::get('/rute', [RuteController::class, 'index'])->name('rute.index');

    Route::middleware(['role:admin'])->group(function () {
        Route::post('/rute', [RuteController::class, 'store'])->name('rute.store');
        Route::put('/rute/{rute}', [RuteController::class, 'update'])->name('rute.update');
        Route::delete('/rute/{rute}', [RuteController::class, 'destroy'])->name('rute.destroy');
    });
});