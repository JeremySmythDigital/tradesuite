// Trade-specific templates for estimates and invoices
// Pre-defined line items, common services, and pricing presets

export interface LineItemPreset {
  description: string;
  category: string;
  unit: 'hour' | 'job' | 'sqft' | 'linear' | 'unit';
  suggestedPrice: { min: number; max: number };
  description2?: string; // Additional details
}

export interface TradeTemplate {
  id: string;
  name: string;
  icon: string;
  color: string;
  lineItems: LineItemPreset[];
  serviceTypes: string[];
  urgencySurcharge: number; // Percentage for emergency calls
}

export const tradeTemplates: Record<string, TradeTemplate> = {
  electrician: {
    id: 'electrician',
    name: 'Electrician',
    icon: 'Zap',
    color: '#f59e0b',
    urgencySurcharge: 50, // 50% for emergency after-hours
    serviceTypes: [
      'Service Call',
      'Panel Upgrade',
      'Rewire',
      'Outlet Installation',
      'Lighting Installation',
      'Ceiling Fan Installation',
      'EV Charger Install',
      'Generator Install',
      'Inspection',
      'Emergency Repair',
    ],
    lineItems: [
      {
        description: 'Service Call - Diagnostic',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 75, max: 150 },
        description2: 'Includes travel time and initial troubleshooting',
      },
      {
        description: 'Panel Upgrade (100A to 200A)',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 1500, max: 3000 },
        description2: 'Includes permit and inspection coordination',
      },
      {
        description: 'Outlet Installation',
        category: 'Installation',
        unit: 'unit',
        suggestedPrice: { min: 75, max: 150 },
      },
      {
        description: 'GFCI Outlet Installation',
        category: 'Installation',
        unit: 'unit',
        suggestedPrice: { min: 125, max: 200 },
      },
      {
        description: 'Ceiling Fan Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 150, max: 300 },
      },
      {
        description: 'Recessed Lighting (per fixture)',
        category: 'Installation',
        unit: 'unit',
        suggestedPrice: { min: 100, max: 200 },
      },
      {
        description: 'Whole House Surge Protector',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 400, max: 700 },
      },
      {
        description: 'EV Charger Installation (Level 2)',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 800, max: 1500 },
      },
      {
        description: 'Lighting Fixture Repair',
        category: 'Repair',
        unit: 'job',
        suggestedPrice: { min: 75, max: 200 },
      },
      {
        description: 'Electrical Inspection',
        category: 'Inspection',
        unit: 'job',
        suggestedPrice: { min: 100, max: 250 },
      },
      {
        description: 'Labor (per hour)',
        category: 'Labor',
        unit: 'hour',
        suggestedPrice: { min: 75, max: 125 },
      },
      {
        description: 'Emergency Service Call (after hours)',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 150, max: 300 },
      },
    ],
  },
  plumber: {
    id: 'plumber',
    name: 'Plumber',
    icon: 'Droplets',
    color: '#2563eb',
    urgencySurcharge: 75,
    serviceTypes: [
      'Service Call',
      'Drain Cleaning',
      'Pipe Repair',
      'Water Heater',
      'Toilet Repair',
      'Faucet Installation',
      'Garbage Disposal',
      'Sump Pump',
      'Sewer Line',
      'Emergency Repair',
    ],
    lineItems: [
      {
        description: 'Service Call & Diagnostic',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 75, max: 125 },
      },
      {
        description: 'Drain Cleaning (Main Line)',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 200, max: 400 },
      },
      {
        description: 'Drain Cleaning (Secondary Line)',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 100, max: 200 },
      },
      {
        description: 'Toilet Repair/Replacement',
        category: 'Repair',
        unit: 'job',
        suggestedPrice: { min: 100, max: 400 },
      },
      {
        description: 'Faucet Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 150, max: 350 },
      },
      {
        description: 'Garbage Disposal Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 200, max: 400 },
      },
      {
        description: 'Water Heater Installation (Standard)',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 800, max: 1500 },
      },
      {
        description: 'Water Heater Installation (Tankless)',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 2000, max: 4000 },
      },
      {
        description: 'Sump Pump Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 800, max: 1500 },
      },
      {
        description: 'Pipe Repair (per foot)',
        category: 'Repair',
        unit: 'linear',
        suggestedPrice: { min: 50, max: 150 },
      },
      {
        description: 'Labor (per hour)',
        category: 'Labor',
        unit: 'hour',
        suggestedPrice: { min: 75, max: 125 },
      },
      {
        description: 'Emergency Service (after hours)',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 200, max: 400 },
      },
    ],
  },
  hvac: {
    id: 'hvac',
    name: 'HVAC',
    icon: 'Wind',
    color: '#ea580c',
    urgencySurcharge: 100,
    serviceTypes: [
      'Service Call',
      'AC Installation',
      'Furnace Installation',
      'AC Repair',
      'Furnace Repair',
      'Duct Cleaning',
      'Maintenance',
      'Thermostat',
      'Heat Pump',
      'Emergency Repair',
    ],
    lineItems: [
      {
        description: 'Service Call & Diagnostic',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 85, max: 150 },
      },
      {
        description: 'AC Tune-Up/Maintenance',
        category: 'Maintenance',
        unit: 'job',
        suggestedPrice: { min: 100, max: 200 },
      },
      {
        description: 'Furnace Tune-Up/Maintenance',
        category: 'Maintenance',
        unit: 'job',
        suggestedPrice: { min: 100, max: 200 },
      },
      {
        description: 'AC Repair (Standard)',
        category: 'Repair',
        unit: 'job',
        suggestedPrice: { min: 150, max: 500 },
      },
      {
        description: 'Refrigerant Recharge (per lb)',
        category: 'Service',
        unit: 'unit',
        suggestedPrice: { min: 50, max: 100 },
      },
      {
        description: 'AC Unit Installation (Residential)',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 3000, max: 7000 },
      },
      {
        description: 'Furnace Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 2500, max: 6000 },
      },
      {
        description: 'Heat Pump Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 4000, max: 10000 },
      },
      {
        description: 'Duct Cleaning (per vent)',
        category: 'Service',
        unit: 'unit',
        suggestedPrice: { min: 25, max: 50 },
      },
      {
        description: 'Thermostat Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 150, max: 400 },
      },
      {
        description: 'Smart Thermostat Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 200, max: 500 },
      },
      {
        description: 'Labor (per hour)',
        category: 'Labor',
        unit: 'hour',
        suggestedPrice: { min: 85, max: 150 },
      },
      {
        description: 'Emergency Service (after hours)',
        category: 'Service',
        unit: 'job',
        suggestedPrice: { min: 200, max: 400 },
      },
    ],
  },
  landscaper: {
    id: 'landscaper',
    name: 'Landscaper',
    icon: 'Leaf',
    color: '#16a34a',
    urgencySurcharge: 0, // Usually not emergency
    serviceTypes: [
      'Maintenance',
      'Lawn Care',
      'Tree Service',
      'Hardscaping',
      'Irrigation',
      'Design',
      'Mulching',
      'Planting',
      'Sod Installation',
      'Fencing',
    ],
    lineItems: [
      {
        description: 'Lawn Mowing (per acre)',
        category: 'Maintenance',
        unit: 'job',
        suggestedPrice: { min: 40, max: 80 },
      },
      {
        description: 'Lawn Mowing (per visit)',
        category: 'Maintenance',
        unit: 'job',
        suggestedPrice: { min: 35, max: 75 },
      },
      {
        description: 'Hedge Trimming',
        category: 'Maintenance',
        unit: 'hour',
        suggestedPrice: { min: 50, max: 100 },
      },
      {
        description: 'Mulching (per yard)',
        category: 'Installation',
        unit: 'unit',
        suggestedPrice: { min: 50, max: 100 },
      },
      {
        description: 'Tree Trimming (per hour)',
        category: 'Tree Service',
        unit: 'hour',
        suggestedPrice: { min: 75, max: 150 },
      },
      {
        description: 'Tree Removal (per tree)',
        category: 'Tree Service',
        unit: 'job',
        suggestedPrice: { min: 300, max: 1500 },
      },
      {
        description: 'Flower Bed Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 200, max: 500 },
      },
      {
        description: 'Sod Installation (per sq ft)',
        category: 'Installation',
        unit: 'sqft',
        suggestedPrice: { min: 0.5, max: 2 },
      },
      {
        description: 'Irrigation System Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 2000, max: 5000 },
      },
      {
        description: 'Paver Patio (per sq ft)',
        category: 'Hardscaping',
        unit: 'sqft',
        suggestedPrice: { min: 10, max: 25 },
      },
      {
        description: 'Retaining Wall (per linear ft)',
        category: 'Hardscaping',
        unit: 'linear',
        suggestedPrice: { min: 25, max: 60 },
      },
      {
        description: 'Labor (per hour)',
        category: 'Labor',
        unit: 'hour',
        suggestedPrice: { min: 40, max: 75 },
      },
      {
        description: 'Spring/Fall Cleanup',
        category: 'Maintenance',
        unit: 'job',
        suggestedPrice: { min: 200, max: 600 },
      },
    ],
  },
  roofer: {
    id: 'roofer',
    name: 'Roofer',
    icon: 'Home',
    color: '#475569',
    urgencySurcharge: 50,
    serviceTypes: [
      'Inspection',
      'Repair',
      'Replacement',
      'Gutters',
      'Skylights',
      'Ventilation',
      'Flashing',
      'Insurance Claim',
      'Emergency Tarp',
      'Maintenance',
    ],
    lineItems: [
      {
        description: 'Roof Inspection',
        category: 'Inspection',
        unit: 'job',
        suggestedPrice: { min: 100, max: 300 },
      },
      {
        description: 'Roing Repair (minor)',
        category: 'Repair',
        unit: 'job',
        suggestedPrice: { min: 200, max: 600 },
      },
      {
        description: 'Roof Repair (major)',
        category: 'Repair',
        unit: 'job',
        suggestedPrice: { min: 500, max: 2000 },
      },
      {
        description: 'Shingle Replacement (per sq)',
        category: 'Repair',
        unit: 'sqft',
        suggestedPrice: { min: 100, max: 200 },
      },
      {
        description: 'Full Roof Replacement (Asphalt)',
        category: 'Replacement',
        unit: 'sqft',
        suggestedPrice: { min: 4, max: 8 },
      },
      {
        description: 'Full Roof Replacement (Metal)',
        category: 'Replacement',
        unit: 'sqft',
        suggestedPrice: { min: 10, max: 20 },
      },
      {
        description: 'Gutter Installation (per linear ft)',
        category: 'Gutters',
        unit: 'linear',
        suggestedPrice: { min: 5, max: 15 },
      },
      {
        description: 'Gutter Cleaning',
        category: 'Maintenance',
        unit: 'job',
        suggestedPrice: { min: 100, max: 300 },
      },
      {
        description: 'Skylight Installation',
        category: 'Installation',
        unit: 'job',
        suggestedPrice: { min: 800, max: 2000 },
      },
      {
        description: 'Emergency Tarp Service',
        category: 'Emergency',
        unit: 'job',
        suggestedPrice: { min: 300, max: 800 },
      },
      {
        description: 'Flashing Repair/Replacement',
        category: 'Repair',
        unit: 'job',
        suggestedPrice: { min: 150, max: 500 },
      },
      {
        description: 'Vent Installation',
        category: 'Installation',
        unit: 'unit',
        suggestedPrice: { min: 100, max: 300 },
      },
      {
        description: 'Labor (per hour)',
        category: 'Labor',
        unit: 'hour',
        suggestedPrice: { min: 50, max: 100 },
      },
    ],
  },
};

// Helper function to get template by trade
export function getTradeTemplate(trade: string): TradeTemplate | undefined {
  return tradeTemplates[trade.toLowerCase()];
}

// Get all trades
export function getAvailableTrades(): string[] {
  return Object.keys(tradeTemplates);
}

// Calculate estimate based on line items
export function calculateEstimateTotal(
  items: Array<{ quantity: number; rate: number }>,
  tax: number = 0
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
}

// Apply urgency surcharge
export function applyUrgencySurcharge(
  amount: number,
  trade: string,
  isEmergency: boolean
): number {
  if (!isEmergency) return amount;
  const template = tradeTemplates[trade.toLowerCase()];
  if (!template) return amount;
  return amount * (1 + template.urgencySurcharge / 100);
}