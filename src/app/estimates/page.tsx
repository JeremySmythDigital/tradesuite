'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Estimate {
  id: string;
  client_id: string;
  client_name?: string;
  estimate_number: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  issue_date: string;
  valid_until: string;
  description?: string;
  items?: EstimateItem[];
  notes?: string;
}

interface EstimateItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Client {
  id: string;
  name: string;
  email?: string;
}

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    client_id: '',
    valid_until: '',
    description: '',
    notes: '',
    items: [{ description: '', quantity: '1', rate: '' }]
  });

  const DIRECTUS_URL = 'https://directus-production-1dd5.up.railway.app';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [estimatesRes, clientsRes] = await Promise.all([
        fetch(`${DIRECTUS_URL}/items/estimates?fields=*,client_id.name,client_id.email`),
        fetch(`${DIRECTUS_URL}/items/clients?fields=id,name,email`)
      ]);
      
      const estimatesData = await estimatesRes.json();
      const clientsData = await clientsRes.json();
      
      const formattedEstimates = (estimatesData.data || []).map((est: any) => ({
        ...est,
        client_name: est.client_id?.name || 'Unknown',
        client_email: est.client_id?.email
      }));
      
      setEstimates(formattedEstimates);
      setClients(clientsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEstimateNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `EST-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const items = formData.items.map(item => ({
      description: item.description,
      quantity: parseFloat(item.quantity) || 0,
      rate: parseFloat(item.rate) || 0,
      amount: (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
    }));

    const totalAmount = items.reduce((sum: number, item) => sum + item.amount, 0);

    const estimateData = {
      client_id: formData.client_id,
      estimate_number: editingEstimate?.estimate_number || generateEstimateNumber(),
      amount: totalAmount,
      status: editingEstimate?.status || 'draft',
      issue_date: editingEstimate?.issue_date || new Date().toISOString().split('T')[0],
      valid_until: formData.valid_until,
      description: formData.description,
      notes: formData.notes,
      items: items
    };

    try {
      if (editingEstimate) {
        await fetch(`${DIRECTUS_URL}/items/estimates/${editingEstimate.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(estimateData)
        });
      } else {
        await fetch(`${DIRECTUS_URL}/items/estimates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(estimateData)
        });
      }
      
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving estimate:', error);
      alert('Failed to save estimate');
    }
  };

  const updateStatus = async (id: string, status: Estimate['status']) => {
    try {
      await fetch(`${DIRECTUS_URL}/items/estimates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const convertToInvoice = async (estimate: Estimate) => {
    try {
      // Create invoice from estimate
      const invoiceData = {
        client_id: estimate.client_id,
        invoice_number: `INV-${estimate.estimate_number.split('-')[1]}-${estimate.estimate_number.split('-')[2]}`,
        amount: estimate.amount,
        status: 'draft',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: estimate.description,
        items: estimate.items
      };

      await fetch(`${DIRECTUS_URL}/items/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      // Mark estimate as accepted
      await updateStatus(estimate.id, 'accepted');
      
      alert('Estimate converted to invoice successfully!');
    } catch (error) {
      console.error('Error converting to invoice:', error);
      alert('Failed to convert estimate to invoice');
    }
  };

  const deleteEstimate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this estimate?')) return;
    
    try {
      await fetch(`${DIRECTUS_URL}/items/estimates/${id}`, {
        method: 'DELETE'
      });
      await fetchData();
    } catch (error) {
      console.error('Error deleting estimate:', error);
    }
  };

  const openModal = (estimate?: Estimate) => {
    if (estimate) {
      setEditingEstimate(estimate);
      setFormData({
        client_id: estimate.client_id,
        valid_until: estimate.valid_until,
        description: estimate.description || '',
        notes: estimate.notes || '',
        items: (estimate.items || [{ description: '', quantity: 1, rate: 0 }]).map((item: any) => ({
          description: item.description,
          quantity: String(item.quantity),
          rate: String(item.rate)
        }))
      });
    } else {
      setEditingEstimate(null);
      setFormData({
        client_id: '',
        valid_until: '',
        description: '',
        notes: '',
        items: [{ description: '', quantity: '1', rate: '' }]
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEstimate(null);
    setFormData({
      client_id: '',
      valid_until: '',
      description: '',
      notes: '',
      items: [{ description: '', quantity: '1', rate: '' }]
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: '1', rate: '' }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateItem = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-700 text-gray-300',
      sent: 'bg-blue-900/50 text-blue-400',
      accepted: 'bg-green-900/50 text-green-400',
      declined: 'bg-red-900/50 text-red-400',
      expired: 'bg-yellow-900/50 text-yellow-400'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-700 text-gray-300';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredEstimates = estimates.filter(est => {
    const matchesSearch = est.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          est.estimate_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || est.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPending = estimates.filter(e => ['draft', 'sent'].includes(e.status)).reduce((sum, e) => sum + e.amount, 0);
  const totalAccepted = estimates.filter(e => e.status === 'accepted').reduce((sum, e) => sum + e.amount, 0);
  const conversionRate = estimates.length > 0 ? 
    ((estimates.filter(e => e.status === 'accepted').length / estimates.filter(e => ['accepted', 'declined'].includes(e.status)).length) * 100 || 0).toFixed(1) : 
    '0.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading estimates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold">Estimates</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
            >
              + New Estimate
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Pending Value</div>
            <div className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPending)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Accepted Value</div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalAccepted)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Conversion Rate</div>
            <div className="text-2xl font-bold text-blue-400">{conversionRate}%</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Estimates</div>
            <div className="text-2xl font-bold">{estimates.length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search estimates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Estimates Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Estimate #</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Client</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Valid Until</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstimates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {estimates.length === 0 ? 'No estimates yet. Create your first estimate!' : 'No matching estimates'}
                  </td>
                </tr>
              ) : (
                filteredEstimates.map((estimate) => (
                  <tr key={estimate.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-4 py-3 font-mono text-sm">{estimate.estimate_number}</td>
                    <td className="px-4 py-3">{estimate.client_name}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(estimate.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(estimate.status)}`}>
                        {estimate.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{estimate.valid_until}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {estimate.status === 'draft' && (
                          <button
                            onClick={() => updateStatus(estimate.id, 'sent')}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Send
                          </button>
                        )}
                        {estimate.status === 'sent' && (
                          <>
                            <button
                              onClick={() => updateStatus(estimate.id, 'accepted')}
                              className="text-green-400 hover:text-green-300 text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateStatus(estimate.id, 'declined')}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {estimate.status === 'accepted' && (
                          <button
                            onClick={() => convertToInvoice(estimate)}
                            className="text-purple-400 hover:text-purple-300 text-sm"
                          >
                            Convert to Invoice
                          </button>
                        )}
                        <button
                          onClick={() => openModal(estimate)}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEstimate(estimate.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingEstimate ? 'Edit Estimate' : 'Create New Estimate'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Line Items</label>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="w-20 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', e.target.value)}
                        className="w-24 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                        step="0.01"
                        min="0"
                        required
                      />
                      <div className="w-24 bg-gray-600 rounded px-3 py-2 text-right text-gray-200">
                        {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0))}
                      </div>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                >
                  + Add Line Item
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
                  placeholder="Additional terms, conditions, or notes..."
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="text-lg font-bold">
                  Total: {formatCurrency(
                    formData.items.reduce((sum, item) => 
                      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium"
                  >
                    {editingEstimate ? 'Update Estimate' : 'Create Estimate'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}