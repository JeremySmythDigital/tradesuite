'use client';

import { useState, useEffect } from 'react';
import { getPriceBookItems, createPriceBookItem, updatePriceBookItem, deletePriceBookItem, type PriceBookItem } from '@/lib/directus-extensions';

const TRADES = ['plumbing', 'electrical', 'hvac', 'landscaping', 'roofing', 'general'] as const;
const CATEGORIES = ['Installation', 'Repair', 'Maintenance', 'Emergency', 'Inspection'] as const;

// Fallback sample data for demo/offline mode
const SAMPLE_ITEMS: PriceBookItem[] = [
  {
    id: '1',
    trade: 'electrical',
    category: 'Installation',
    service_name: 'Ceiling Fan Install',
    description: 'Standard ceiling fan installation (existing wiring)',
    unit_cost: 75,
    unit_price: 150,
    unit_of_measure: 'each',
    estimated_time: 60,
    active: true,
  },
  {
    id: '2',
    trade: 'plumbing',
    category: 'Repair',
    service_name: 'Faucet Repair',
    description: 'Repair leaky faucet, replace washers/o-rings',
    unit_cost: 25,
    unit_price: 85,
    unit_of_measure: 'each',
    estimated_time: 30,
    active: true,
  },
  {
    id: '3',
    trade: 'hvac',
    category: 'Maintenance',
    service_name: 'AC Tune-Up',
    description: 'Annual AC maintenance and inspection',
    unit_cost: 50,
    unit_price: 125,
    unit_of_measure: 'each',
    estimated_time: 90,
    active: true,
  },
];

export default function PriceBookPage() {
  const [items, setItems] = useState<PriceBookItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PriceBookItem[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for new/edit item
  const [formData, setFormData] = useState<Omit<PriceBookItem, 'id'>>({
    trade: 'general',
    category: 'Installation',
    service_name: '',
    description: '',
    unit_cost: 0,
    unit_price: 0,
    unit_of_measure: 'each',
    estimated_time: 60,
    active: true,
  });

  // Fetch items from Directus on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getPriceBookItems();
    
    if (result.success && result.data && result.data.length > 0) {
      setItems(result.data);
      setFilteredItems(result.data);
    } else {
      // Fallback to sample data for demo
      console.log('Using sample data - Directus not configured or empty');
      setItems(SAMPLE_ITEMS);
      setFilteredItems(SAMPLE_ITEMS);
    }
    
    setLoading(false);
  };

  // Filter items
  useEffect(() => {
    let filtered = items;
    
    if (selectedTrade !== 'all') {
      filtered = filtered.filter(item => item.trade === selectedTrade);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.service_name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [items, selectedTrade, selectedCategory, searchQuery]);

  // Calculate profit margin for display
  const calculateMargin = (cost: number, price: number) => {
    return price > 0 ? (((price - cost) / price) * 100).toFixed(0) : '0';
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing item
      const result = await updatePriceBookItem(editingId, formData);
      if (result.success) {
        await fetchItems();
        setEditingId(null);
        setIsAddingNew(false);
      } else {
        // Update local state for demo mode
        setItems(items.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        ));
        setEditingId(null);
        setIsAddingNew(false);
      }
    } else {
      // Create new item
      const result = await createPriceBookItem(formData);
      if (result.success && result.data) {
        setItems([...items, result.data]);
      } else {
        // Add to local state for demo mode
        const newItem = { ...formData, id: Date.now().toString() };
        setItems([...items, newItem]);
      }
      setIsAddingNew(false);
    }
    
    // Reset form
    setFormData({
      trade: 'general',
      category: 'Installation',
      service_name: '',
      description: '',
      unit_cost: 0,
      unit_price: 0,
      unit_of_measure: 'each',
      estimated_time: 60,
      active: true,
    });
  };

  // Handle edit
  const handleEdit = (item: PriceBookItem) => {
    setEditingId(item.id);
    setIsAddingNew(true);
    setFormData({
      trade: item.trade,
      category: item.category,
      service_name: item.service_name,
      description: item.description || '',
      unit_cost: item.unit_cost,
      unit_price: item.unit_price,
      unit_of_measure: item.unit_of_measure,
      estimated_time: item.estimated_time,
      active: item.active,
    });
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const result = await deletePriceBookItem(id);
    if (result.success) {
      setItems(items.filter(item => item.id !== id));
    } else {
      // Remove from local state for demo mode
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Summary stats
  const totalServices = items.length;
  const avgMargin = items.length > 0 
    ? (items.reduce((sum, item) => sum + parseFloat(calculateMargin(item.unit_cost, item.unit_price)), 0) / items.length).toFixed(0)
    : '0';
  const activeCount = items.filter(item => item.active).length;
  const avgTime = items.length > 0
    ? Math.round(items.reduce((sum, item) => sum + item.estimated_time, 0) / items.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Price Book</h1>
        <p className="text-gray-600 mt-1">Manage service pricing by trade and category</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Services</p>
          <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Avg Margin</p>
          <p className="text-2xl font-bold text-green-600">{avgMargin}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Active Services</p>
          <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Avg Time</p>
          <p className="text-2xl font-bold text-gray-900">{avgTime} min</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Trades</option>
              {TRADES.map(trade => (
                <option key={trade} value={trade}>
                  {trade.charAt(0).toUpperCase() + trade.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Add New Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            setIsAddingNew(true);
            setEditingId(null);
            setFormData({
              trade: 'general',
              category: 'Installation',
              service_name: '',
              description: '',
              unit_cost: 0,
              unit_price: 0,
              unit_of_measure: 'each',
              estimated_time: 60,
              active: true,
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
                <select
                  value={formData.trade}
                  onChange={(e) => setFormData({ ...formData, trade: e.target.value as PriceBookItem['trade'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TRADES.map(trade => (
                    <option key={trade} value={trade}>
                      {trade.charAt(0).toUpperCase() + trade.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                <select
                  value={formData.unit_of_measure}
                  onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value as PriceBookItem['unit_of_measure'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="each">Each</option>
                  <option value="hour">Hour</option>
                  <option value="linear_ft">Linear Foot</option>
                  <option value="sq_ft">Square Foot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unit_cost}
                  onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (minutes)</label>
                <input
                  type="number"
                  value={formData.estimated_time}
                  onChange={(e) => setFormData({ ...formData, estimated_time: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Service
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingId(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className={!item.active ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.service_name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {item.trade.charAt(0).toUpperCase() + item.trade.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ${item.unit_cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    ${item.unit_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parseFloat(calculateMargin(item.unit_cost, item.unit_price)) >= 50
                        ? 'bg-green-100 text-green-800'
                        : parseFloat(calculateMargin(item.unit_cost, item.unit_price)) >= 30
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {calculateMargin(item.unit_cost, item.unit_price)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.estimated_time} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No services found. Add your first service to get started.
        </div>
      )}
    </div>
  );
}