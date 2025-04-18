<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ComensalController;

Route::apiResource('comensales', ComensalController::class);