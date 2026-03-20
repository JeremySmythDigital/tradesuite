import { NextRequest, NextResponse } from 'next/server';

// QuickBooks Online Integration
// Environment variables needed:
// QUICKBOOKS_CLIENT_ID=your_client_id
// QUICKBOOKS_CLIENT_SECRET=your_client_secret
// QUICKBOOKS_REALM_ID=your_realm_id (company ID)
// QUICKBOOKS_ACCESS_TOKEN=your_access_token
// QUICKBOOKS_REFRESH_TOKEN=your_refresh_token

interface QuickBooksInvoice {
  customerRef: { value: string; name: string };
  lineItems: Array<{
    description: string;
    amount: number;
    quantity: number;
    unitPrice: number;
  }>;
  dueDate: string;
  memo?: string;
}

interface QuickBooksCustomer {
  DisplayName: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  BillAddr?: { Line1: string; City: string; CountrySubDivisionCode: string; PostalCode: string };
}

const QB_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://quickbooks.api.intuit.com'
  : 'https://sandbox-quickbooks.api.intuit.com';

// Export invoice to QuickBooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    const REALM_ID = process.env.QUICKBOOKS_REALM_ID;
    const ACCESS_TOKEN = process.env.QUICKBOOKS_ACCESS_TOKEN;

    if (!REALM_ID || !ACCESS_TOKEN) {
      // Development mode
      console.log('[DEV] QuickBooks export:', { action, data });
      return NextResponse.json({
        success: true,
        message: 'Exported to QuickBooks (development mode)',
        mockId: `QB-${Date.now()}`,
      });
    }

    const headers = {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    let response;

    switch (action) {
      case 'export_invoice':
        // First ensure customer exists in QuickBooks
        const customerResponse = await ensureQuickBooksCustomer(data.customer, headers, REALM_ID);
        if (!customerResponse.success) {
          return NextResponse.json({ error: 'Failed to create/find customer in QuickBooks' }, { status: 500 });
        }

        // Create invoice in QuickBooks
        const invoiceData = {
          Line: data.lineItems.map((item: any) => ({
            Amount: item.amount,
            DetailType: 'SalesItemLineDetail',
            SalesItemLineDetail: {
              ItemRef: { value: '1', name: 'Services' },
              Qty: item.quantity,
              UnitPrice: item.unitPrice,
            },
            Description: item.description,
          })),
          CustomerRef: { value: customerResponse.customerId },
          DueDate: data.dueDate,
          TxnDate: data.txnDate || new Date().toISOString().split('T')[0],
          DocNumber: data.invoiceNumber,
          PrivateNote: data.memo,
        };

        response = await fetch(`${QB_BASE_URL}/v3/company/${REALM_ID}/invoice`, {
          method: 'POST',
          headers,
          body: JSON.stringify(invoiceData),
        });

        const invoiceResult = await response.json();
        
        if (response.ok) {
          return NextResponse.json({
            success: true,
            quickbooksId: invoiceResult.Invoice.Id,
            syncToken: invoiceResult.Invoice.SyncToken,
          });
        } else {
          return NextResponse.json({ error: invoiceResult }, { status: 500 });
        }

      case 'export_customer':
        response = await ensureQuickBooksCustomer(data, headers, REALM_ID);
        return NextResponse.json(response);

      case 'sync_customers':
        response = await fetch(`${QB_BASE_URL}/v3/company/${REALM_ID}/query?query=select * from Customer`, {
          method: 'GET',
          headers,
        });
        const customersResult = await response.json();
        return NextResponse.json({
          success: true,
          customers: customersResult.QueryResponse?.Customer || [],
        });

      case 'sync_invoices':
        response = await fetch(`${QB_BASE_URL}/v3/company/${REALM_ID}/query?query=select * from Invoice where TxnDate >= '${data.startDate}'`, {
          method: 'GET',
          headers,
        });
        const invoicesResult = await response.json();
        return NextResponse.json({
          success: true,
          invoices: invoicesResult.QueryResponse?.Invoice || [],
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('QuickBooks error:', error);
    return NextResponse.json({ error: 'QuickBooks integration failed' }, { status: 500 });
  }
}

async function ensureQuickBooksCustomer(
  customer: QuickBooksCustomer,
  headers: Record<string, string>,
  realmId: string
): Promise<{ success: boolean; customerId?: string; error?: string }> {
  try {
    // Search for existing customer by email or name
    const searchResponse = await fetch(
      `${QB_BASE_URL}/v3/company/${realmId}/query?query=select * from Customer where DisplayName like '${encodeURIComponent(customer.DisplayName)}'`,
      { method: 'GET', headers }
    );

    const searchResult = await searchResponse.json();
    
    if (searchResult.QueryResponse?.Customer?.length > 0) {
      return { success: true, customerId: searchResult.QueryResponse.Customer[0].Id };
    }

    // Create new customer
    const customerData = {
      DisplayName: customer.DisplayName,
      PrimaryEmailAddr: customer.PrimaryEmailAddr,
      PrimaryPhone: customer.PrimaryPhone,
      BillAddr: customer.BillAddr,
    };

    const createResponse = await fetch(`${QB_BASE_URL}/v3/company/${realmId}/customer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(customerData),
    });

    const createResult = await createResponse.json();

    if (createResponse.ok && createResult.Customer) {
      return { success: true, customerId: createResult.Customer.Id };
    }

    return { success: false, error: 'Failed to create customer' };
  } catch (error) {
    return { success: false, error: 'Customer sync failed' };
  }
}

// Get QuickBooks connection status
export async function GET() {
  const REALM_ID = process.env.QUICKBOOKS_REALM_ID;
  const ACCESS_TOKEN = process.env.QUICKBOOKS_ACCESS_TOKEN;

  return NextResponse.json({
    connected: !!(REALM_ID && ACCESS_TOKEN),
    realmId: REALM_ID || null,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  });
}