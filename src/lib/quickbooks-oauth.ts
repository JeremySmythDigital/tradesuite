// QuickBooks OAuth configuration
const QUICKBOOKS_CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID;
const QUICKBOOKS_CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET;
const QUICKBOOKS_REDIRECT_URI = process.env.QUICKBOOKS_REDIRECT_URI || 'https://tradesuite.vercel.app/api/quickbooks/callback';

interface QuickBooksToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
  token_type: string;
  realmId?: string;
}

interface QuickBooksCompany {
  CompanyName: string;
  CompanyId: string;
}

export class QuickBooksService {
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private redirectUri: string;
  private baseUrl: string;
  
  constructor() {
    this.clientId = QUICKBOOKS_CLIENT_ID;
    this.clientSecret = QUICKBOOKS_CLIENT_SECRET;
    this.redirectUri = QUICKBOOKS_REDIRECT_URI;
    this.baseUrl = 'https://oauth.platform.intuit.com/oauth2/v1';
  }
  
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
  
  // Generate authorization URL
  getAuthorizationUrl(state: string): string {
    const scope = 'com.intuit.quickbooks.accounting com.intuit.quickbooks.payment';
    const params = new URLSearchParams({
      client_id: this.clientId!,
      response_type: 'code',
      scope,
      redirect_uri: this.redirectUri,
      state,
    });
    
    return `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;
  }
  
  // Exchange authorization code for tokens
  async exchangeCode(code: string, realmId: string): Promise<{ success: boolean; tokens?: QuickBooksToken; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'QuickBooks not configured' };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/tokens/bearer`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri,
        }).toString(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('QuickBooks token exchange error:', data);
        return { success: false, error: data.error || 'Token exchange failed' };
      }
      
      return { 
        success: true, 
        tokens: {
          ...data,
          realmId,
        }
      };
    } catch (error) {
      console.error('QuickBooks OAuth error:', error);
      return { success: false, error: 'OAuth exchange failed' };
    }
  }
  
  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<{ success: boolean; tokens?: QuickBooksToken; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'QuickBooks not configured' };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/tokens/bearer`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('QuickBooks token refresh error:', data);
        return { success: false, error: data.error || 'Token refresh failed' };
      }
      
      return { success: true, tokens: data };
    } catch (error) {
      console.error('QuickBooks refresh error:', error);
      return { success: false, error: 'Token refresh failed' };
    }
  }
  
  // Disconnect / revoke tokens
  async revokeToken(token: string): Promise<{ success: boolean }> {
    if (!this.isConfigured()) {
      return { success: false };
    }
    
    try {
      await fetch(`${this.baseUrl}/tokens/revoke`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      return { success: true };
    } catch (error) {
      console.error('QuickBooks revoke error:', error);
      return { success: false };
    }
  }
  
  // Get company info
  async getCompanyInfo(accessToken: string, realmId: string): Promise<QuickBooksCompany | null> {
    try {
      const response = await fetch(
        `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('QuickBooks company info error:', data);
        return null;
      }
      
      return {
        CompanyName: data.CompanyInfo?.CompanyName || 'Unknown',
        CompanyId: realmId,
      };
    } catch (error) {
      console.error('QuickBooks company info error:', error);
      return null;
    }
  }
  
  // Create invoice in QuickBooks
  async createInvoice(accessToken: string, realmId: string, invoiceData: {
    customerRef: { value: string; name: string };
    lineItems: Array<{ description: string; amount: number; quantity: number; itemRef?: string }>;
    dueDate: string;
  }): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
    try {
      const invoice = {
        Line: invoiceData.lineItems.map((item, i) => ({
          Id: String(i + 1),
          LineNum: i + 1,
          Description: item.description,
          Amount: item.amount,
          DetailType: 'SalesItemLineDetail',
          SalesItemLineDetail: {
            ItemRef: { value: item.itemRef || '1' },
            Qty: item.quantity,
            UnitPrice: item.amount / item.quantity,
          },
        })),
        CustomerRef: invoiceData.customerRef,
        DueDate: invoiceData.dueDate,
      };
      
      const response = await fetch(
        `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/invoice`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(invoice),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('QuickBooks invoice error:', data);
        return { success: false, error: data.Fault?.Error?.[0]?.Message || 'Invoice creation failed' };
      }
      
      return { success: true, invoiceId: data.Invoice?.Id };
    } catch (error) {
      console.error('QuickBooks invoice error:', error);
      return { success: false, error: 'Invoice creation failed' };
    }
  }
  
  // Sync customer to QuickBooks
  async createCustomer(accessToken: string, realmId: string, customerData: {
    displayName: string;
    companyName?: string;
    email?: string;
    phone?: string;
    billingAddress?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
    };
  }): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
      const customer = {
        DisplayName: customerData.displayName,
        CompanyName: customerData.companyName,
        PrimaryEmailAddr: customerData.email ? { Address: customerData.email } : undefined,
        PrimaryPhone: customerData.phone ? { FreeFormNumber: customerData.phone } : undefined,
        BillAddr: customerData.billingAddress ? {
          Line1: customerData.billingAddress.line1,
          City: customerData.billingAddress.city,
          CountrySubDivisionCode: customerData.billingAddress.state,
          PostalCode: customerData.billingAddress.postalCode,
        } : undefined,
      };
      
      const response = await fetch(
        `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/customer`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(customer),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('QuickBooks customer error:', data);
        return { success: false, error: data.Fault?.Error?.[0]?.Message || 'Customer creation failed' };
      }
      
      return { success: true, customerId: data.Customer?.Id };
    } catch (error) {
      console.error('QuickBooks customer error:', error);
      return { success: false, error: 'Customer creation failed' };
    }
  }
}

// Singleton instance
export const quickbooksService = new QuickBooksService();