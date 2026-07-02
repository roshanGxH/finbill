<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController; // Imported Dashboard Controller

// Public Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Multi-Tenant Routes (Require Valid JWT Token)
Route::middleware('auth:api')->group(function () {
    
    // Auth Management
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    // Business Modules CRUD APIs
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('payments', PaymentController::class);

    // Void request tickets desk
    Route::get('/void-requests', [\App\Http\Controllers\Api\VoidRequestController::class, 'index']);
    Route::post('/void-requests', [\App\Http\Controllers\Api\VoidRequestController::class, 'store']);
    Route::post('/void-requests/{voidRequest}/approve', [\App\Http\Controllers\Api\VoidRequestController::class, 'approve']);
    Route::post('/void-requests/{voidRequest}/reject', [\App\Http\Controllers\Api\VoidRequestController::class, 'reject']);

    // PDF Document Export Streams
    Route::get('/invoices/{invoice}/pdf', [\App\Http\Controllers\Api\InvoiceController::class, 'downloadPdf']);

    
    // Point 6: Dashboard Core Business Analytics Metrics Added Here
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/revenue', [DashboardController::class, 'revenue']);
    
});
