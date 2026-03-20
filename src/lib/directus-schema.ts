// Directus Collection Schemas for Cypress Signal
// Run these SQL commands in Directus to create the collections

// Price Book Items Collection
/*
CREATE TABLE price_book_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) DEFAULT 'draft',
  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Custom Fields
  trade VARCHAR(50) NOT NULL, -- plumbing, electrical, hvac, landscaping, roofing, general
  category VARCHAR(50) NOT NULL, -- Installation, Repair, Maintenance, Emergency, Inspection
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  unit_cost DECIMAL(10,2) NOT NULL, -- What the business pays
  unit_price DECIMAL(10,2) NOT NULL, -- What customer pays
  unit_of_measure VARCHAR(50) DEFAULT 'each', -- hour, each, linear_ft, sq_ft
  estimated_time INTEGER DEFAULT 0, -- Minutes
  active BOOLEAN DEFAULT true,
  
  -- Organization
  organization_id UUID REFERENCES organizations(id)
);

CREATE INDEX idx_pricebook_trade ON price_book_items(trade);
CREATE INDEX idx_pricebook_category ON price_book_items(category);
CREATE INDEX idx_pricebook_active ON price_book_items(active);
*/

// Job Costing Collection
/*
CREATE TABLE job_costing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) DEFAULT 'draft',
  sort INTEGER DEFAULT 0,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  
  -- Custom Fields
  job_id UUID NOT NULL REFERENCES jobs(id),
  quoted_price DECIMAL(10,2) NOT NULL,
  
  -- Materials (stored as JSON array)
  materials JSONB DEFAULT '[]', -- [{name, cost, quantity}]
  
  -- Labor
  labor_hours DECIMAL(6,2) DEFAULT 0,
  labor_rate DECIMAL(10,2) DEFAULT 75.00, -- Default hourly rate
  
  -- Calculated fields (auto-updated)
  material_cost DECIMAL(10,2) DEFAULT 0,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  profit DECIMAL(10,2) DEFAULT 0,
  profit_margin DECIMAL(6,2) DEFAULT 0, -- Percentage
  
  -- GHL sync
  ghl_estimate_id VARCHAR(255),
  ghl_invoice_id VARCHAR(255),
  
  -- Organization
  organization_id UUID REFERENCES organizations(id)
);

CREATE INDEX idx_jobcosting_job ON job_costing(job_id);
CREATE INDEX idx_jobcosting_ghl ON job_costing(ghl_estimate_id);
*/

// Technicians Collection (for dispatch board)
/*
CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) DEFAULT 'active',
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Custom Fields
  user_id UUID REFERENCES directus_users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  
  -- GPS tracking
  current_lat DECIMAL(10,7),
  current_lng DECIMAL(10,7),
  location_updated_at TIMESTAMP,
  
  -- Status
  current_status VARCHAR(50) DEFAULT 'offline', -- available, busy, offline
  current_job_id UUID REFERENCES jobs(id),
  
  -- Skills/Trades
  trades JSONB DEFAULT '[]', -- ['plumbing', 'electrical', 'hvac']
  
  -- Organization
  organization_id UUID REFERENCES organizations(id)
);

CREATE INDEX idx_technicians_status ON technicians(current_status);
CREATE INDEX idx_technicians_location ON technicians(current_lat, current_lng);
*/
