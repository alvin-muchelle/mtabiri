<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeatherController;

Route::prefix('v1')
     ->group(function () {
         Route::get('weather/current',   [WeatherController::class, 'current']);
         Route::get('weather/forecast',  [WeatherController::class, 'forecast']);
     });
