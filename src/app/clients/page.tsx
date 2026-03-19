'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Phone, Mail, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: string;
  date_created: string;
  job_count?: number;
  total_revenue?: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await fetch(`${DIRECTUS_URL}/items/clients?sort=-date_created`);
      const data = await res.json();
      setClients(data.data || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.name.trim()) return;

    try {
      if (editingClient) {
        // Update existing
        const res = await fetch(`${DIRECTUS_URL}/items/clients/${editingClient.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          await fetchClients();
          setShowAddModal(false);
          setEditingClient(null);
          resetForm();
        }
      } else {
        // Create new
        const res = await fetch(`${DIRECTUS_URL}/items/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, status: 'active' }),
        });
        if (res.ok) {
          await fetchClients();
          setShowAddModal(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this client?')) return;
    try {
      await fetch(`${DIRECTUS_URL}/items/clients/${id}`, { method: 'DELETE' });
      setClients(clients.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  }

  function resetForm() {
    setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
  }

  function openEdit(client: Client) {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || '',
    });
    setShowAddModal(true);
  }

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-xl">TradeSuite</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/clients" className="text-blue-600 font-medium">Clients</Link>
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
              <Link href="/invoices" className="text-gray-600 hover:text-gray-900">Invoices</Link>
              <Link href="/estimates" className="text-gray-600 hover:text-gray-900">Estimates</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600">{clients.length} clients</p>
          </div>
          <button
            onClick={() => { resetForm(); setEditingClient(null); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Clients List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No clients yet</p>
            <button
              onClick={() => { resetForm(); setEditingClient(null); setShowAddModal(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Client
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/clients/${client.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {client.name}
                      </Link>
                      {client.notes && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{client.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {client.email && (
                          <a href={`mailto:${client.email}`} className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </a>
                        )}
                        {client.phone && (
                          <a href={`tel:${client.phone}`} className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.address && (
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate max-w-xs">{client.address}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(client)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingClient ? 'Edit Client' : 'Add Client'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowAddModal(false); setEditingClient(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingClient ? 'Update' : 'Add'} Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}