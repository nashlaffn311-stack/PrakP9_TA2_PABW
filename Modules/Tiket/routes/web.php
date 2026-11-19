<?php

use Illuminate\Support\Facades\Route;
use Modules\Tiket\Http\Controllers\TiketController;

Route::middleware(['auth'])->group(function () {
    Route::get('/tiket', [TiketController::class, 'index'])->name('tiket.index');
    Route::get('/tiket/data', [TiketController::class, 'listData'])->name('tiket.data');
    Route::post('/tiket', [TiketController::class, 'store'])->name('tiket.store');
    Route::put('/tiket/{tiket}', [TiketController::class, 'update'])->name('tiket.update');
    Route::delete('/tiket/{tiket}', [TiketController::class, 'destroy'])->name('tiket.destroy');
});