'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Users, MapPin, Phone,
  Clock, Wrench, CheckCircle, AlertCircle, Truck, Settings
} from 'lucide-react';

interface Job {
  id: string;
  customer: string;
  address: string;
  phone: string;
  trade: string;
  type: string;
  assignedTo: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startTime: string;
  duration: number; // hours
  notes?: string;
}

const mockJobs: Job[] = [
  { id: '1', customer: 'John Smith', address: '123 Main St, Sacramento', phone: '(916) 555-0101', trade: 'electrician', type: 'Panel Upgrade', assignedTo: 'Mike Roberts', status: 'scheduled', startTime: '08:00', duration: 4, notes: '200A panel upgrade' },
  { id: '2', customer: 'Sarah Johnson', address: '456 Oak Ave, Sacramento', phone: '(916) 555-0102', trade: 'plumber', type: 'Water Heater Install', assignedTo: 'Tom Chen', status: 'scheduled', startTime: '09:00', duration: 3 },
  { id: '3', customer: 'Bob Williams', address: '789 Pine Rd, Sacramento', phone: '(916) 555-0103', trade: 'hvac', type: 'AC Repair', assignedTo: 'Dave Kim', status: 'in_progress', startTime: '10:30', duration: 2 },
  { id: '4', customer: 'Lisa Brown', address: '321 Elm St, Sacramento', phone: '(916) 555-0104', trade: 'landscaper', type: 'Lawn Maintenance', assignedTo: null, status: 'scheduled', startTime: '07:00', duration: 1 },
  { id: '5', customer: 'Mike Davis', address: '654 Cedar Ln, Sacramento', phone: '(916) 555-0105', trade: 'roofer', type: 'Inspection', assignedTo: 'James Wilson', status: 'completed', startTime: '11:00', duration: 1, notes: 'Annual roof inspection' },
];

const technicians = [
  { id: '1', name: 'Mike Roberts', trade: 'electrician', status: 'available' },
  { id: '2', name: 'Tom Chen', trade: 'plumber', status: 'on_job' },
  { id: '3', name: 'Dave Kim', trade: 'hvac', status: 'available' },
  { id: '4', name: 'James Wilson', trade: 'roofer', status: 'available' },
  { id: '5', name: 'Emily Garcia', trade: 'landscaper', status: 'on_job' },
];

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const tradeColors: Record<string, string> = {
  electrician: 'bg-yellow-100 text-yellow-800',
  plumber: 'bg-blue-100 text-blue-800',
  hvac: 'bg-orange-100 text-orange-800',
  landscaper: 'bg-green-100 text-green-800',
  roofer: 'bg-slate-100 text-slate-800',
};

export default function DispatchBoard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const scheduledJobs = jobs.filter(j => j.status === 'scheduled');
  const inProgressJobs = jobs.filter(j => j.status === 'in_progress');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Wrench className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">Cypress Signal</span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
                <Link href="/clients" className="text-gray-600 hover:text-gray-900">Clients</Link>
                <Link href="/estimates" className="text-gray-600 hover:text-gray-900">Estimates</Link>
                <Link href="/dispatch" className="text-blue-600 font-medium">Dispatch</Link>
              </nav>
              <Link 
                href="/" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Exit Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 font-display">Dispatch Board</h1>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Week
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-medium text-gray-900 min-w-[140px] text-center">
                  {formatDate(selectedDate)}
                </span>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-4 h-4" />
                New Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Technicians */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Technicians</h2>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {technicians.map((tech) => (
                  <div key={tech.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                          tech.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {tech.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tech.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{tech.trade}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tech.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tech.status === 'available' ? 'Available' : 'On Job'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Columns - Jobs by Status */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Scheduled */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-blue-900">Scheduled</h3>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                      {scheduledJobs.length}
                    </span>
                  </div>
                </div>
                <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                  {scheduledJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedJob?.id === job.id ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900">{job.customer}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${tradeColors[job.trade]}`}>
                          {job.trade}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{job.type}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{job.startTime} ({job.duration}h)</span>
                      </div>
                      {job.assignedTo ? (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Assigned:</span> {job.assignedTo}
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-yellow-600 font-medium">
                          ⚠️ Unassigned
                        </div>
                      )}
                    </div>
                  ))}
                  {scheduledJobs.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No scheduled jobs</p>
                    </div>
                  )}
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-yellow-900">In Progress</h3>
                    <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                      {inProgressJobs.length}
                    </span>
                  </div>
                </div>
                <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                  {inProgressJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedJob?.id === job.id ? 'border-yellow-500 bg-yellow-50' : 'border-transparent bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900">{job.customer}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${tradeColors[job.trade]}`}>
                          {job.trade}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{job.type}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{job.startTime} ({job.duration}h)</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Assigned:</span> {job.assignedTo}
                      </div>
                      <button className="mt-2 w-full py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                        Mark Complete
                      </button>
                    </div>
                  ))}
                  {inProgressJobs.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No jobs in progress</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-green-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-green-900">Completed</h3>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                      {completedJobs.length}
                    </span>
                  </div>
                </div>
                <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                  {completedJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedJob?.id === job.id ? 'border-green-500 bg-green-50' : 'border-transparent bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900">{job.customer}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${tradeColors[job.trade]}`}>
                          {job.trade}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{job.type}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Completed today</span>
                      </div>
                      <div className="mt-2">
                        <button className="w-full py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                          Create Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                  {completedJobs.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No completed jobs</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{selectedJob.type}</h3>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-sm font-medium ${statusColors[selectedJob.status]}`}>
                  {selectedJob.status.replace('_', ' ')}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900">{selectedJob.customer}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedJob.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="font-medium text-gray-900">{selectedJob.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedJob.startTime} · {selectedJob.duration} hours</p>
                  </div>
                </div>
                {selectedJob.assignedTo && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-medium text-gray-900">{selectedJob.assignedTo}</p>
                  </div>
                )}
                {selectedJob.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-900">{selectedJob.notes}</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Reschedule
                </button>
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Edit Job
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}