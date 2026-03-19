'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Invoice {
  id: string;
  client_id: string;
  client_name?: string;
  invoice_number: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  description?: string;
  items?: InvoiceItem[];
}

interface InvoiceItem {
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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    client_id: '',
    amount: '',
    due_date: '',
    description: '',
    items: [{ description: '', quantity: '1', rate: '' }]
  });

  const DIRECTUS_URL = 'https://directus-production-1dd5.up.railway.app';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invoicesRes, clientsRes] = await Promise.all([
        fetch(`${DIRECTUS_URL}/items/invoices?fields=*,client_id.name,client_id.email`),
        fetch(`${DIRECTUS_URL}/items/clients?fields=id,name,email`)
      ]);
      
      const invoicesData = await invoicesRes.json();
      const clientsData = await clientsRes.json();
      
      const formattedInvoices = (invoicesData.data || []).map((inv: any) => ({
        ...inv,
        client_name: inv.client_id?.name || 'Unknown',
        client_email: inv.client_id?.email
      }));
      
      setInvoices(formattedInvoices);
      setClients(clientsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  };

  const calculateTotal = (items: { quantity: number; rate: number }[]) => {
    return items.reduce((sum: number, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const items = formData.items.map(item => ({
      description: item.description,
      quantity: parseFloat(item.quantity) || 0,
      rate: parseFloat(item.rate) || 0,
      amount: (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
    }));

    const totalAmount = calculateTotal(items as any);

    const invoiceData = {
      client_id: formData.client_id,
      invoice_number: editingInvoice?.invoice_number || generateInvoiceNumber(),
      amount: totalAmount,
      status: editingInvoice?.status || 'draft',
      issue_date: editingInvoice?.issue_date || new Date().toISOString().split('T')[0],
      due_date: formData.due_date,
      description: formData.description,
      items: items
    };

    try {
      if (editingInvoice) {
        await fetch(`${DIRECTUS_URL}/items/invoices/${editingInvoice.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData)
        });
      } else {
        await fetch(`${DIRECTUS_URL}/items/invoices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData)
        });
      }
      
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    }
  };

  const updateStatus = async (id: string, status: Invoice['status']) => {
    try {
      const updateData: any = { status };
      if (status === 'paid') {
        updateData.paid_date = new Date().toISOString().split('T')[0];
      }
      
      await fetch(`${DIRECTUS_URL}/items/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      await fetch(`${DIRECTUS_URL}/items/invoices/${id}`, {
        method: 'DELETE'
      });
      await fetchData();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const openModal = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        client_id: invoice.client_id,
        amount: invoice.amount.toString(),
        due_date: invoice.due_date,
        description: invoice.description || '',
        items: (invoice.items || [{ description: '', quantity: 1, rate: 0 }]).map((item: any) => ({
          description: item.description,
          quantity: String(item.quantity),
          rate: String(item.rate)
        }))
      });
    } else {
      setEditingInvoice(null);
      setFormData({
        client_id: '',
        amount: '',
        due_date: '',
        description: '',
        items: [{ description: '', quantity: '1', rate: '' }]
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setFormData({
      client_id: '',
      amount: '',
      due_date: '',
      description: '',
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
      paid: 'bg-green-900/50 text-green-400',
      overdue: 'bg-red-900/50 text-red-400',
      cancelled: 'bg-gray-800 text-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-700 text-gray-300';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const outstanding = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading invoices...</div>
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
              <h1 className="text-2xl font-bold">Invoices</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
            >
              + New Invoice
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Collected</div>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-yellow-400">{formatCurrency(outstanding)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-400">{formatCurrency(overdueAmount)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Invoices</div>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search invoices..."
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
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Invoices Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Invoice #</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Client</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Due Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {invoices.length === 0 ? 'No invoices yet. Create your first invoice!' : 'No matching invoices'}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-4 py-3 font-mono text-sm">{invoice.invoice_number}</td>
                    <td className="px-4 py-3">{invoice.client_name}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(invoice.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{invoice.due_date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => updateStatus(invoice.id, 'sent')}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Send
                          </button>
                        )}
                        {invoice.status === 'sent' && (
                          <button
                            onClick={() => updateStatus(invoice.id, 'paid')}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            Mark Paid
                          </button>
                        )}
                        {(invoice.status === 'sent' || invoice.status === 'draft') && (
                          <button
                            onClick={() => updateStatus(invoice.id, 'overdue')}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Overdue
                          </button>
                        )}
                        <button
                          onClick={() => openModal(invoice)}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
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
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
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
                    {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
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