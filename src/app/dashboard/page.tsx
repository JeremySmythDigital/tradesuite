import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, FileText, DollarSign, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard - TradeSuite',
  description: 'Manage your trade business',
};

// Mock data - will be replaced with Directus API calls
const stats = [
  { label: 'Active Clients', value: '24', change: '+3 this month' },
  { label: 'Pending Jobs', value: '8', change: '2 scheduled today' },
  { label: 'Outstanding Invoices', value: '$12,450', change: '4 overdue' },
  { label: 'This Month Revenue', value: '$28,900', change: '+15% vs last month' },
];

const recentJobs = [
  { id: '1', client: 'Oakwood Apartments', title: 'Panel Upgrade', status: 'In Progress', date: 'Today' },
  { id: '2', client: 'John Smith', title: 'Outdoor Lighting', status: 'Scheduled', date: 'Tomorrow' },
  { id: '3', client: 'City Mall', title: 'Emergency Repair', status: 'Completed', date: 'Yesterday' },
];

export default function DashboardPage() {
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
            <Link href="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.map((job) => (
              <div key={job.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.client}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {job.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{job.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}