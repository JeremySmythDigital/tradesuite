'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, DollarSign, Clock, CheckCircle, AlertCircle, FileText, 
  Phone, Mail, MapPin, ChevronRight, Wrench
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  address?: string;
  description?: string;
  estimated_hours?: number;
  customer_notes?: string;
}

interface Invoice {
  id: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  description?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

export default function CustomerPortal() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'invoices' | 'profile'>('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from authenticated session
    // For demo, using mock data
    setTimeout(() => {
      setCustomer({
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(916) 555-0101',
        address: '123 Main St, Sacramento, CA 95814',
        company: 'Smith Properties LLC',
      });
      setJobs([
        { 
          id: '1', 
          title: 'Panel Upgrade', 
          status: 'scheduled', 
          scheduled_date: '2026-03-22T09:00:00',
          address: '123 Main St, Sacramento, CA 95814',
          description: '200A panel upgrade with new breakers',
          estimated_hours: 4
        },
        { 
          id: '2', 
          title: 'Outlet Installation', 
          status: 'completed', 
          scheduled_date: '2026-03-15T14:00:00',
          address: '123 Main St, Sacramento, CA 95814',
          description: 'Install 4 new outlets in garage'
        },
      ]);
      setInvoices([
        { id: 'INV-001', amount: 1250.00, status: 'paid', due_date: '2026-03-20', description: 'Outlet Installation' },
        { id: 'INV-002', amount: 2400.00, status: 'sent', due_date: '2026-03-29', description: 'Panel Upgrade (deposit)' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const upcomingJobs = jobs.filter(j => j.status === 'scheduled' || j.status === 'in_progress');
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const unpaidInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue');
  const paidInvoices = invoices.filter(i => i.status === 'paid');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Wrench className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl">TradeSuite</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Customer Portal</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Customer Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-2">Welcome, {customer?.name}</h1>
          {customer?.company && (
            <p className="text-blue-100">{customer.company}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{upcomingJobs.length}</p>
                <p className="text-sm text-gray-500">Upcoming Jobs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedJobs.length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{unpaidInvoices.length}</p>
                <p className="text-sm text-gray-500">Unpaid Invoices</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-500">Hours Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {(['jobs', 'invoices', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Upcoming Jobs */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
              {upcomingJobs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{job.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                              {job.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(job.scheduled_date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            {job.estimated_hours && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{job.estimated_hours} hours</span>
                              </div>
                            )}
                          </div>
                          {job.description && (
                            <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                          )}
                          {job.address && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{job.address}</span>
                            </div>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Jobs */}
            {completedJobs.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Completed Jobs</h2>
                <div className="space-y-3">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(job.scheduled_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            {/* Unpaid Invoices */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Pay Now</h2>
              {unpaidInvoices.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <p className="text-gray-500">All invoices are paid!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unpaidInvoices.map((invoice) => (
                    <div key={invoice.id} className="bg-white rounded-xl border border-yellow-200 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{invoice.id}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                              {invoice.status}
                            </span>
                          </div>
                          <p className="text-gray-600">{invoice.description}</p>
                          <p className="text-sm text-gray-500 mt-1">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paid Invoices */}
            {paidInvoices.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment History</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Invoice</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paidInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{invoice.description}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">${invoice.amount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-lg">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={customer?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={customer?.company || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={customer?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Verified</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={customer?.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
                  <textarea
                    value={customer?.address || ''}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Communication Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Email reminders before appointments</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">SMS notifications for job updates</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Marketing emails about new services</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}