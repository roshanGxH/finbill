<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;

class ClientController extends Controller
{
    // List all clients for the authenticated company
    public function index()
    {
        $clients = Client::forCompany(auth()->user()->company_id)
            ->latest()
            ->get();

        return response()->json($clients);
    }

    // Create a new client under the user's company
    public function store(StoreClientRequest $request)
    {
        $client = Client::create([
            'company_id' => auth()->user()->company_id,
            'client_name' => $request->client_name,
            'email' => $request->email,
            'current_balance' => 0.00,
        ]);

        return response()->json([
            'message' => 'Client created successfully',
            'data' => $client
        ], 201);
    }

    // View specific client data with multi-tenant check
    public function show(Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($client);
    }

    // Update client profile data
    public function update(UpdateClientRequest $request, Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $client->update([
            'client_name' => $request->client_name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Client updated successfully',
            'data' => $client
        ]);
    }

    // Safely delete a company client
    public function destroy(Client $client)
    {
        if ($client->company_id !== auth()->user()->company_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully'
        ]);
    }
}
