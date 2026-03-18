import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, FileText, DollarSign, Plus, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard - TradeSuite',
  description: 'Manage your trade business',
};

// Server-side data fetching
async function getDashboardData() {
  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';
  
  try {
    // Fetch all data in parallel
    const [clientsRes, jobsRes, invoicesRes] = await Promise.all([
      fetch(`${DIRECTUS_URL}/items/clients?limit=5&sort=-date_created`, { 
        next: { revalidate: 60 } // Cache for 60 seconds
      }),
      fetch(`${DIRECTUS_URL}/items/jobs?limit=5&sort=-scheduled_date`, { 
        next: { revalidate: 60 }
      }),
      fetch(`${DIRECTUS_URL}/items/invoices?limit=5&sort=-date_created`, { 
        next: { revalidate: 60 }
      }),
    ]);

    const [clients, jobs, invoices] = await Promise.all([
      clientsRes.ok ? clientsRes.json() : { data: [] },
      jobsRes.ok ? jobsRes.json() : { data: [] },
      invoicesRes.ok ? invoicesRes.json() : { data: [] },
    ]);

    // Calculate stats
    const totalRevenue = invoices.data?.reduce((sum: number, inv: any) => 
      inv.status === 'paid' ? sum + (inv.amount || 0) : sum, 0) || 0;
    
    const outstandingInvoices = invoices.data?.filter((inv: any) => inv.status !== 'paid').length || 0;

    return {
      clients: clients.data || [],
      jobs: jobs.data || [],
      invoices: invoices.data || [],
      stats: {
        clients: clients.data?.length || 0,
        activeJobs: jobs.data?.filter((j: any) => j.status !== 'completed').length || 0,
        outstandingInvoices,
        revenue: totalRevenue,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      clients: [],
      jobs: [],
      invoices: [],
      stats: {
        clients: 0,
        activeJobs: 0,
        outstandingInvoices: 0,
        revenue: 0,
      },
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const stats = [
    { label: 'Clients', value: data.stats.clients, change: 'Active clients' },
    { label: 'Active Jobs', value: data.stats.activeJobs, change: 'In progress' },
    { label: 'Outstanding', value: `$${data.stats.outstandingInvoices.toLocaleString()}`, change: 'Pending invoices' },
    { label: 'Revenue', value: `$${data.stats.revenue.toLocaleString()}`, change: 'Total paid' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Job
              </button>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign Out</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-blue-600 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/clients" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Clients</span>
          </Link>
          <Link href="/jobs" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Jobs</span>
          </Link>
          <Link href="/estimates" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Estimates</span>
          </Link>
          <Link href="/invoices" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Invoices</span>
          </Link>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Jobs</h2>
            <Link href="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {data.jobs.length > 0 ? (
              data.jobs.map((job: any) => (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.description?.substring(0, 50) || 'No description'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                      job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {job.status || 'pending'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{job.scheduled_date || 'Not scheduled'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No jobs yet. Create your first job to get started.
              </div>
            )}
          </div>
        </div>

        {/* Recent Clients */}
        {data.clients.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">Recent Clients</h2>
              <Link href="/clients" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {data.clients.slice(0, 3).map((client: any) => (
                <div key={client.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {client.status || 'active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}