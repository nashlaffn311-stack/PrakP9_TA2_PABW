<?php

use Illuminate\Support\Facades\Route;
use Modules\Armada\Http\Controllers\ArmadaController;

Route::middleware(['auth'])->group(function () {
    Route::get('/armada', [ArmadaController::class, 'index'])->name('armada.index');
    Route::get('/armada/data', [ArmadaController::class, 'listData'])->name('armada.data');

    Route::middleware(['role:admin'])->group(function () {
        Route::post('/armada', [ArmadaController::class, 'store'])->name('armada.store');
        Route::put('/armada/{armada}', [ArmadaController::class, 'update'])->name('armada.update');
        Route::delete('/armada/{armada}', [ArmadaController::class, 'destroy'])->name('armada.destroy');
    });
});