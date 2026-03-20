'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, DollarSign, User, AlertCircle, CheckCircle, Clock, MoreHorizontal } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  address: string;
  scheduled_date: string;
  estimated_hours: number;
  client_id: number;
  client?: { name: string; phone: string };
  value?: number;
}

interface Client {
  id: number;
  name: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-gray-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  emergency: 'text-red-600',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    address: '',
    scheduled_date: '',
    estimated_hours: 2,
    client_id: '',
  });

  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

  useEffect(() => {
    fetchJobs();
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await fetch(`${DIRECTUS_URL}/items/clients?limit=100`);
      const data = await res.json();
      setClients(data.data || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  }

  async function fetchJobs() {
    try {
      const res = await fetch(`${DIRECTUS_URL}/items/jobs?sort=-scheduled_date&fields=*,client_id.name,client_id.phone`);
      const data = await res.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.title.trim() || !formData.client_id) return;

    try {
      const payload = {
        ...formData,
        client_id: parseInt(formData.client_id),
        estimated_hours: parseFloat(String(formData.estimated_hours)) || 2,
      };

      if (editingJob) {
        const res = await fetch(`${DIRECTUS_URL}/items/jobs/${editingJob.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchJobs();
          setShowAddModal(false);
          setEditingJob(null);
          resetForm();
        }
      } else {
        const res = await fetch(`${DIRECTUS_URL}/items/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchJobs();
          setShowAddModal(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this job?')) return;
    try {
      await fetch(`${DIRECTUS_URL}/items/jobs/${id}`, { method: 'DELETE' });
      setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  }

  async function updateStatus(job: Job, newStatus: string) {
    try {
      await fetch(`${DIRECTUS_URL}/items/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      address: '',
      scheduled_date: '',
      estimated_hours: 2,
      client_id: '',
    });
  }

  function openEdit(job: Job) {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || '',
      status: job.status || 'pending',
      priority: job.priority || 'medium',
      address: job.address || '',
      scheduled_date: job.scheduled_date ? job.scheduled_date.split('T')[0] : '',
      estimated_hours: job.estimated_hours || 2,
      client_id: String(job.client_id),
    });
    setShowAddModal(true);
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.client as any)?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-xl">Cypress Signal</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/clients" className="text-gray-600 hover:text-gray-900">Clients</Link>
              <Link href="/jobs" className="text-blue-600 font-medium">Jobs</Link>
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
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="text-gray-600">{jobs.length} total jobs</p>
          </div>
          <button
            onClick={() => { resetForm(); setEditingJob(null); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Job
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No jobs yet</p>
            <button
              onClick={() => { resetForm(); setEditingJob(null); setShowAddModal(true); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const client = job.client as any;
              return (
                <div key={job.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[job.status] || STATUS_COLORS.pending}`}>
                          {job.status?.replace('_', ' ') || 'pending'}
                        </span>
                        {job.priority === 'emergency' && (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Emergency
                          </span>
                        )}
                      </div>
                      
                      {job.description && (
                        <p className="text-gray-600 text-sm mb-2">{job.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {client && (
                          <Link href={`/clients/${job.client_id}`} className="flex items-center gap-1 hover:text-blue-600">
                            <User className="w-3 h-3" />
                            {client.name}
                          </Link>
                        )}
                        {job.scheduled_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(job.scheduled_date).toLocaleDateString()}
                          </span>
                        )}
                        {job.estimated_hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.estimated_hours}h
                          </span>
                        )}
                        {job.address && (
                          <span className="truncate max-w-xs">{job.address}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {job.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(job, 'in_progress')}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Start
                        </button>
                      )}
                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => updateStatus(job, 'completed')}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(job)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingJob ? 'Edit Job' : 'New Job'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Panel Upgrade, Service Call, Inspection"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Describe the work to be done..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                    <input
                      type="number"
                      value={formData.estimated_hours}
                      onChange={(e) => setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0.5"
                      step="0.5"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Job site address"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowAddModal(false); setEditingJob(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.title.trim() || !formData.client_id}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingJob ? 'Update' : 'Create'} Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}