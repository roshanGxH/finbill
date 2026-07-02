<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Company;
use App\Models\User;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\LedgerEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    private $user1;
    private $company1;
    private $client1;
    private $token1;

    private $user2;
    private $company2;
    private $client2;
    private $token2;

    protected function setUp(): void
    {
        parent::setUp();

        // Tenant 1 Setup
        $this->company1 = Company::create([
            'name' => 'Company One',
            'tax_id' => 'TAX-11111',
            'currency' => 'INR'
        ]);

        $this->user1 = User::create([
            'company_id' => $this->company1->id,
            'name' => 'User One',
            'email' => 'user1@example.com',
            'password' => Hash::make('password123')
        ]);

        $this->client1 = Client::create([
            'company_id' => $this->company1->id,
            'client_name' => 'Client One',
            'email' => 'client1@example.com',
            'current_balance' => 0.00
        ]);

        $this->token1 = JWTAuth::fromUser($this->user1);

        // Tenant 2 Setup
        $this->company2 = Company::create([
            'name' => 'Company Two',
            'tax_id' => 'TAX-22222',
            'currency' => 'INR'
        ]);

        $this->user2 = User::create([
            'company_id' => $this->company2->id,
            'name' => 'User Two',
            'email' => 'user2@example.com',
            'password' => Hash::make('password123')
        ]);

        $this->client2 = Client::create([
            'company_id' => $this->company2->id,
            'client_name' => 'Client Two',
            'email' => 'client2@example.com',
            'current_balance' => 0.00
        ]);

        $this->token2 = JWTAuth::fromUser($this->user2);
    }

    /**
     * Test invoice creation updates client balance and ledger entries.
     */
    public function test_invoice_creation_updates_client_balance_and_ledger()
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $this->token1])
            ->postJson('/api/invoices', [
                'client_id' => $this->client1->id,
                'due_date' => now()->addDays(10)->toDateString(),
                'items' => [
                    [
                        'description' => 'Development Service A',
                        'quantity' => 5,
                        'unit_price' => 100.00
                    ],
                    [
                        'description' => 'Consulting Service B',
                        'quantity' => 2,
                        'unit_price' => 250.00
                    ]
                ]
            ]);

        $response->assertStatus(201);

        // Grand Total: 5*100 + 2*250 = 1000.00
        $this->assertEquals(1000.00, $this->client1->fresh()->current_balance);

        // Ledger check
        $this->assertDatabaseHas('ledger_entries', [
            'client_id' => $this->client1->id,
            'type' => 'debit',
            'amount' => 1000.00,
            'description' => 'Invoice Generated'
        ]);
    }

    /**
     * Test validation rules prevent empty items or invalid structures.
     */
    public function test_invoice_creation_validates_inputs()
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $this->token1])
            ->postJson('/api/invoices', [
                'client_id' => $this->client1->id,
                'due_date' => now()->subDay()->toDateString(), // past date
                'items' => [] // empty items
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['due_date', 'items']);
    }

    /**
     * Test multi-tenant isolation ensures Tenant A cannot interact with Tenant B's data.
     */
    public function test_multi_tenant_isolation_integrity()
    {
        // Tenant 1 attempts to create invoice for Tenant 2's client
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $this->token1])
            ->postJson('/api/invoices', [
                'client_id' => $this->client2->id,
                'due_date' => now()->addDays(5)->toDateString(),
                'items' => [
                    ['description' => 'Hacker service', 'quantity' => 1, 'unit_price' => 5000.00]
                ]
            ]);

        // Should return 404 since Client 2 is out of Client scope for Company 1
        $response->assertStatus(404);

        // Create an invoice belonging to Tenant 2
        $invoice2 = Invoice::create([
            'client_id' => $this->client2->id,
            'invoice_number' => 'INV-TENANT2',
            'total_amount' => 500.00,
            'due_date' => now()->addDays(5)->toDateString(),
            'status' => 'unpaid'
        ]);

        // Tenant 1 attempts to fetch Tenant 2's invoice directly
        $responseFetch = $this->withHeaders(['Authorization' => 'Bearer ' . $this->token1])
            ->getJson('/api/invoices/' . $invoice2->id);

        $responseFetch->assertStatus(404);

        // Tenant 1 attempts to delete Tenant 2's invoice directly
        $responseDelete = $this->withHeaders(['Authorization' => 'Bearer ' . $this->token1])
            ->deleteJson('/api/invoices/' . $invoice2->id);

        $responseDelete->assertStatus(404);
    }
}
