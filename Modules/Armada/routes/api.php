<?php

use Illuminate\Support\Facades\Route;
use Modules\Armada\Http\Controllers\ArmadaController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('armadas', ArmadaController::class)->names('armada');
});
