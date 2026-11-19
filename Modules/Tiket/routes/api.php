<?php

use Illuminate\Support\Facades\Route;
use Modules\Tiket\Http\Controllers\TiketController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('tikets', TiketController::class)->names('tiket');
});
