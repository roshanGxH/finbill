<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ e($invoice->invoice_number) }}</title>
    <style>
        /* SECURE & COMPATIBLE FONT SYSTEM: Supports unicode symbols securely */
        body { font-family: 'DejaVu Sans', sans-serif; color: #333; line-height: 1.5; font-size: 14px; }
        .invoice-box { max-width: 800px; margin: auto; padding: 20px; }
        .invoice-header { width: 100%; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; }
        .title { font-size: 28px; font-weight: bold; color: #3b82f6; }
        .meta-table { width: 100%; margin-top: 15px; margin-bottom: 30px; }
        .meta-td { width: 50%; vertical-align: top; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details-table th { background: #3b82f6; color: #fff; text-align: left; padding: 10px; font-weight: 600; }
        .details-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; word-wrap: break-word; }
        .total-section { text-align: right; margin-top: 30px; font-size: 18px; font-weight: bold; color: #111827; }
        .status-badge { text-transform: uppercase; font-weight: bold; font-size: 12px; padding: 3px 8px; border-radius: 4px; }
        .status-unpaid { background: #fef3c7; color: #d97706; }
        .status-paid { background: #d1fae5; color: #059669; }
    </style>
</head>
<body>

<div class="invoice-box">
    <!-- Header -->
    <table class="invoice-header" width="100%">
        <tr>
            <td class="title">FinBill System</td>
            <td style="text-align: right; font-size: 20px; font-weight: bold; color: #4b5563;">INVOICE</td>
        </tr>
    </table>

    <!-- Meta Details (XSS Defended via strict Blade escaping) -->
    <table class="meta-table">
        <tr>
            <td class="meta-td">
                <strong>Billed To:</strong><br>
                Client Name: {{ $invoice->client->client_name }}<br>
                Email: {{ $invoice->client->email ?? 'N/A' }}
            </td>
            <td class="meta-td" style="text-align: right;">
                <strong>Invoice Details:</strong><br>
                Invoice No: {{ $invoice->invoice_number }}<br>
                Due Date: {{ $invoice->due_date }}<br>
                Status: <span class="status-badge status-{{ $invoice->status }}">{{ $invoice->status }}</span>
            </td>
        </tr>
    </table>

    <!-- Line Items Table -->
    <table class="details-table">
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: center; width: 10%;">Qty</th>
                <th style="text-align: right; width: 20%;">Unit Price</th>
                <th style="text-align: right; width: 25%;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td>{{ $item->description }}</td>
                <td style="text-align: center;">{{ $item->quantity }}</td>
                <td style="text-align: right;">
                    <!-- CURRENCY CONFIG: For Rupees use &#8377; | For Euro change to &euro; -->
                    &#8377;{{ number_format($item->unit_price, 2) }}
                </td>
                <td style="text-align: right;">
                    <!-- CURRENCY CONFIG: For Rupees use &#8377; | For Euro change to &euro; -->
                    &#8377;{{ number_format($item->line_total, 2) }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Grand Total -->
    <div class="total-section">
        <!-- CURRENCY CONFIG: For Rupees use &#8377; | For Euro change to &euro; -->
        Grand Total: &#8377;{{ number_format($invoice->total_amount, 2) }}
    </div>
</div>

</body>
</html>
