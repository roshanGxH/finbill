<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company; // Imported the Company Model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // Imported DB Facade for Database Transactions

class AuthController extends Controller
{
    // New Register Method (Creates both Company and User atomically)
    public function register(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'tax_id' => 'required|string|unique:companies,tax_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        DB::beginTransaction();

        try {
            // 1. First, create the Company background entry
            $company = Company::create([
                'name' => $request->company_name,
                'tax_id' => $request->tax_id,
                'currency' => 'INR'
            ]);

            // 2. Next, create the User and link them to the newly created Company
            $user = User::create([
                'company_id' => $company->id,
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Company and user created successfully',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Registration failed: ' . $e->getMessage(), [
                'exception' => $e
            ]);

            return response()->json([
                'message' => 'An error occurred during registration. Please try again.'
            ], 500);
        }
    }

    // Login Method
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
    'token' => $token,
    // Force fully inject relational database structures during authorization callback token handshake
    'user' => auth()->user()->load('company')
]);
    }

    // Me Method
    public function me()
{
    // Load contextual profile details with linked tenant company brand attributes array
    return response()->json(auth()->user()->load('company'));
}


    // Logout Method
    public function logout()
    {
        auth()->logout();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    // Refresh Method
    public function refresh()
    {
        return response()->json([
            'token' => auth()->refresh(),
            'token_type' => 'bearer'
        ]);
    }
}
