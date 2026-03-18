import { createDirectus, rest, authentication, readMe, readItems, createItem } from '@directus/sdk';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

// Create the client
export const directus = createDirectus(DIRECTUS_URL)
  .with(authentication())
  .with(rest());

export type DirectusClient = typeof directus;

// Auth helpers
export async function login(email: string, password: string) {
  try {
    const result = await directus.login(email, password);
    return { success: true, data: result };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Invalid credentials' };
  }
}

export async function register(userData: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}) {
  try {
    // Register via custom endpoint
    const response = await fetch(`${DIRECTUS_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    }
    
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to create account' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

export async function logout() {
  try {
    await directus.logout();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
}

export async function getCurrentUser() {
  try {
    const user = await directus.request(readMe());
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: 'Not authenticated' };
  }
}

// Client API
export async function getClients() {
  try {
    const clients = await directus.request(
      readItems('clients', {
        fields: ['*', 'organization_id.*'],
        sort: ['-date_created'],
      })
    );
    return { success: true, data: clients };
  } catch (error) {
    return { success: false, error: 'Failed to fetch clients' };
  }
}

export async function createClient(clientData: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  organization_id?: string;
}) {
  try {
    const client = await directus.request(createItem('clients', clientData));
    return { success: true, data: client };
  } catch (error) {
    return { success: false, error: 'Failed to create client' };
  }
}

// Jobs API
export async function getJobs() {
  try {
    const jobs = await directus.request(
      readItems('jobs', {
        fields: ['*', 'client_id.*'],
        sort: ['-scheduled_date'],
      })
    );
    return { success: true, data: jobs };
  } catch (error) {
    return { success: false, error: 'Failed to fetch jobs' };
  }
}

export async function createJob(jobData: {
  title: string;
  description?: string;
  status: string;
  priority?: string;
  address?: string;
  scheduled_date?: string;
  estimated_hours?: number;
  client_id?: string;
}) {
  try {
    const job = await directus.request(createItem('jobs', jobData));
    return { success: true, data: job };
  } catch (error) {
    return { success: false, error: 'Failed to create job' };
  }
}

// Invoices API
export async function getInvoices() {
  try {
    const invoices = await directus.request(
      readItems('invoices', {
        fields: ['*', 'client_id.*'],
        sort: ['-date_created'],
      })
    );
    return { success: true, data: invoices };
  } catch (error) {
    return { success: false, error: 'Failed to fetch invoices' };
  }
}

// Estimates API
export async function getEstimates() {
  try {
    const estimates = await directus.request(
      readItems('estimates', {
        fields: ['*', 'client_id.*'],
        sort: ['-date_created'],
      })
    );
    return { success: true, data: estimates };
  } catch (error) {
    return { success: false, error: 'Failed to fetch estimates' };
  }
}

// Check auth status
export async function checkAuth() {
  try {
    const result = await directus.refresh();
    return { authenticated: true, user: result };
  } catch {
    return { authenticated: false };
  }
}