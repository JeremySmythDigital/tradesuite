import { directus } from './directus';
import { readItems, createItem, updateItem, deleteItem } from '@directus/sdk';

// Re-export for convenience

// ============ PRICE BOOK ============

export interface PriceBookItem {
  id: string;
  trade: 'plumbing' | 'electrical' | 'hvac' | 'landscaping' | 'roofing' | 'general';
  category: string;
  service_name: string;
  description?: string;
  unit_cost: number;
  unit_price: number;
  unit_of_measure: 'hour' | 'each' | 'linear_ft' | 'sq_ft';
  estimated_time: number; // minutes
  active: boolean;
}

export async function getPriceBookItems(filters?: {
  trade?: string;
  category?: string;
  search?: string;
}): Promise<{ success: boolean; data?: PriceBookItem[]; error?: string }> {
  try {
    const filter: Record<string, unknown> = { active: { _eq: true } };
    
    if (filters?.trade) {
      filter.trade = { _eq: filters.trade };
    }
    if (filters?.category) {
      filter.category = { _eq: filters.category };
    }
    if (filters?.search) {
      filter._or = [
        { service_name: { _icontains: filters.search } },
        { description: { _icontains: filters.search } },
      ];
    }

    const items = await directus.request(
      readItems('price_book_items', {
        filter,
        sort: ['trade', 'category', 'service_name'],
      })
    );
    return { success: true, data: items as PriceBookItem[] };
  } catch (error) {
    console.error('Error fetching price book:', error);
    return { success: false, error: 'Failed to fetch price book items' };
  }
}

export async function createPriceBookItem(item: Omit<PriceBookItem, 'id'>): Promise<{ success: boolean; data?: PriceBookItem; error?: string }> {
  try {
    const created = await directus.request(
      createItem('price_book_items', {
        ...item,
        status: 'published',
      })
    );
    return { success: true, data: created as PriceBookItem };
  } catch (error) {
    console.error('Error creating price book item:', error);
    return { success: false, error: 'Failed to create price book item' };
  }
}

export async function updatePriceBookItem(id: string, updates: Partial<PriceBookItem>): Promise<{ success: boolean; data?: PriceBookItem; error?: string }> {
  try {
    const updated = await directus.request(
      updateItem('price_book_items', id, updates)
    );
    return { success: true, data: updated as PriceBookItem };
  } catch (error) {
    console.error('Error updating price book item:', error);
    return { success: false, error: 'Failed to update price book item' };
  }
}

export async function deletePriceBookItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await directus.request(deleteItem('price_book_items', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting price book item:', error);
    return { success: false, error: 'Failed to delete price book item' };
  }
}

// ============ JOB COSTING ============

export interface JobCosting {
  id: string;
  job_id: string;
  quoted_price: number;
  materials: Array<{ id?: string; name: string; cost: number; quantity: number }>;
  labor_hours: number;
  labor_rate: number;
  material_cost: number;
  labor_cost: number;
  total_cost: number;
  profit: number;
  profit_margin: number;
  ghl_estimate_id?: string;
  ghl_invoice_id?: string;
}

export async function getJobCosting(jobId: string): Promise<{ success: boolean; data?: JobCosting; error?: string }> {
  try {
    const costings = await directus.request(
      readItems('job_costing', {
        filter: { job_id: { _eq: jobId } },
        limit: 1,
      })
    );
    
    if (costings.length > 0) {
      return { success: true, data: costings[0] as JobCosting };
    }
    
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error fetching job costing:', error);
    return { success: false, error: 'Failed to fetch job costing' };
  }
}

export async function saveJobCosting(data: {
  job_id: string;
  quoted_price: number;
  materials: Array<{ id?: string; name: string; cost: number; quantity: number }>;
  labor_hours: number;
  labor_rate: number;
}): Promise<{ success: boolean; data?: JobCosting; error?: string }> {
  try {
    // Calculate costs
    const material_cost = data.materials.reduce((sum, m) => sum + (m.cost * m.quantity), 0);
    const labor_cost = data.labor_hours * data.labor_rate;
    const total_cost = material_cost + labor_cost;
    const profit = data.quoted_price - total_cost;
    const profit_margin = data.quoted_price > 0 ? (profit / data.quoted_price) * 100 : 0;

    const costing = {
      ...data,
      material_cost,
      labor_cost,
      total_cost,
      profit,
      profit_margin,
      status: 'published',
    };

    const created = await directus.request(
      createItem('job_costing', costing)
    );
    
    return { success: true, data: created as JobCosting };
  } catch (error) {
    console.error('Error saving job costing:', error);
    return { success: false, error: 'Failed to save job costing' };
  }
}

export async function updateJobCosting(id: string, data: Partial<JobCosting>): Promise<{ success: boolean; data?: JobCosting; error?: string }> {
  try {
    // Recalculate costs if materials or labor changed
    if (data.materials || data.labor_hours || data.labor_rate || data.quoted_price) {
      const existing = await getJobCosting(data.job_id || '');
      if (existing.data) {
        const materials = data.materials || existing.data.materials;
        const labor_hours = data.labor_hours ?? existing.data.labor_hours;
        const labor_rate = data.labor_rate ?? existing.data.labor_rate;
        const quoted_price = data.quoted_price ?? existing.data.quoted_price;

        data.material_cost = materials.reduce((sum: number, m) => sum + (m.cost * m.quantity), 0);
        data.labor_cost = labor_hours * labor_rate;
        data.total_cost = data.material_cost + data.labor_cost;
        data.profit = quoted_price - data.total_cost;
        data.profit_margin = quoted_price > 0 ? (data.profit / quoted_price) * 100 : 0;
      }
    }

    const updated = await directus.request(
      updateItem('job_costing', id, data)
    );
    return { success: true, data: updated as JobCosting };
  } catch (error) {
    console.error('Error updating job costing:', error);
    return { success: false, error: 'Failed to update job costing' };
  }
}

// ============ TECHNICIANS ============

export interface Technician {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  current_lat?: number;
  current_lng?: number;
  location_updated_at?: string;
  current_status: 'available' | 'busy' | 'offline';
  current_job_id?: string;
  trades: string[];
}

export async function getTechnicians(): Promise<{ success: boolean; data?: Technician[]; error?: string }> {
  try {
    const technicians = await directus.request(
      readItems('technicians', {
        filter: { status: { _eq: 'active' } },
        sort: ['name'],
      })
    );
    return { success: true, data: technicians as Technician[] };
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return { success: false, error: 'Failed to fetch technicians' };
  }
}

export async function updateTechnicianLocation(
  technicianId: string,
  lat: number,
  lng: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await directus.request(
      updateItem('technicians', technicianId, {
        current_lat: lat,
        current_lng: lng,
        location_updated_at: new Date().toISOString(),
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating technician location:', error);
    return { success: false, error: 'Failed to update location' };
  }
}

export async function assignJobToTechnician(
  jobId: string,
  technicianId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await directus.request(
      updateItem('technicians', technicianId, {
        current_job_id: jobId,
        current_status: 'busy',
      })
    );
    
    // Also update the job with assigned technician
    await directus.request(
      updateItem('jobs', jobId, {
        assigned_technician_id: technicianId,
      })
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error assigning job:', error);
    return { success: false, error: 'Failed to assign job' };
  }
}

export async function completeJob(technicianId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await directus.request(
      updateItem('technicians', technicianId, {
        current_job_id: null,
        current_status: 'available',
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error completing job:', error);
    return { success: false, error: 'Failed to complete job' };
  }
}
