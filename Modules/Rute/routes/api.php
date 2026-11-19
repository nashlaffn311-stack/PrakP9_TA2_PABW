<?php

use Illuminate\Support\Facades\Route;
use Modules\Rute\Http\Controllers\RuteController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('rutes', RuteController::class)->names('rute');
});
