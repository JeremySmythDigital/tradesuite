'use client';

import { useState } from 'react';

// Price Book Item Types
interface PriceBookItem {
  id: string;
  trade: 'plumbing' | 'electrical' | 'hvac' | 'landscaping' | 'roofing' | 'general';
  category: string;
  serviceName: string;
  description: string;
  unitCost: number;
  unitPrice: number;
  unitOfMeasure: 'hour' | 'each' | 'linear_ft' | 'sq_ft';
  estimatedTime: number; // minutes
  active: boolean;
}

const TRADES = ['plumbing', 'electrical', 'hvac', 'landscaping', 'roofing', 'general'] as const;
const CATEGORIES = ['Installation', 'Repair', 'Maintenance', 'Emergency', 'Inspection'] as const;

// Sample data
const SAMPLE_ITEMS: PriceBookItem[] = [
  {
    id: '1',
    trade: 'electrical',
    category: 'Installation',
    serviceName: 'Ceiling Fan Install',
    description: 'Standard ceiling fan installation (existing wiring)',
    unitCost: 75,
    unitPrice: 150,
    unitOfMeasure: 'each',
    estimatedTime: 60,
    active: true,
  },
  {
    id: '2',
    trade: 'plumbing',
    category: 'Repair',
    serviceName: 'Faucet Repair',
    description: 'Repair leaky faucet, replace washers/o-rings',
    unitCost: 25,
    unitPrice: 85,
    unitOfMeasure: 'each',
    estimatedTime: 30,
    active: true,
  },
  {
    id: '3',
    trade: 'hvac',
    category: 'Maintenance',
    serviceName: 'AC Tune-Up',
    description: 'Annual AC maintenance and inspection',
    unitCost: 50,
    unitPrice: 125,
    unitOfMeasure: 'each',
    estimatedTime: 90,
    active: true,
  },
];

export default function PriceBookPage() {
  const [items, setItems] = useState<PriceBookItem[]>(SAMPLE_ITEMS);
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  // Filter items
  const filteredItems = items.filter(item => {
    const matchesTrade = selectedTrade === 'all' || item.trade === selectedTrade;
    const matchesSearch = item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrade && matchesSearch;
  });
  
  // Calculate profit margin
  const calculateMargin = (item: PriceBookItem) => {
    return ((item.unitPrice - item.unitCost) / item.unitPrice * 100).toFixed(0);
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Price Book</h1>
        <button
          onClick={() => setIsAddingItem(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Service
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Trades</option>
              {TRADES.map(trade => (
                <option key={trade} value={trade}>
                  {trade.charAt(0).toUpperCase() + trade.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trade / Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margin
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.serviceName}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.trade}</div>
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  $${item.unitCost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  $${item.unitPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    parseInt(calculateMargin(item)) >= 50 ? 'bg-green-100 text-green-800' :
                    parseInt(calculateMargin(item)) >= 30 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {calculateMargin(item)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.estimatedTime} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Services</div>
          <div className="text-2xl font-bold">{items.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Avg Margin</div>
          <div className="text-2xl font-bold text-green-600">
            {(items.reduce((sum, i) => sum + (i.unitPrice - i.unitCost) / i.unitPrice, 0) / items.length * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold">{items.filter(i => i.active).length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Avg Time</div>
          <div className="text-2xl font-bold">
            {(items.reduce((sum, i) => sum + i.estimatedTime, 0) / items.length).toFixed(0)} min
          </div>
        </div>
      </div>
    </div>
  );
}
