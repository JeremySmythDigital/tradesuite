'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTechnicians, assignJobToTechnician, completeJob, type Technician } from '@/lib/directus-extensions';
import { getJobs } from '@/lib/directus';

// Types
interface Job {
  id: string;
  title: string;
  status: 'lead' | 'scheduled' | 'in_progress' | 'completed';
  address: string;
  scheduled_date?: string;
  client_id?: { name: string; phone?: string } | string;
  assigned_technician_id?: string;
}

// Sample technicians for demo
const SAMPLE_TECHNICIANS: Technician[] = [
  { id: '1', name: 'Mike Johnson', email: 'mike@cypresssignal.com', phone: '555-0101', current_status: 'available', trades: ['plumbing', 'hvac'], current_lat: 29.7604, current_lng: -95.3698 },
  { id: '2', name: 'Sarah Chen', email: 'sarah@cypresssignal.com', phone: '555-0102', current_status: 'busy', trades: ['electrical'], current_lat: 29.7554, current_lng: -95.3598, current_job_id: 'job-1' },
  { id: '3', name: 'Carlos Rivera', email: 'carlos@cypresssignal.com', phone: '555-0103', current_status: 'available', trades: ['landscaping', 'general'], current_lat: 29.7654, current_lng: -95.3798 },
  { id: '4', name: 'Emma Wilson', email: 'emma@cypresssignal.com', phone: '555-0104', current_status: 'offline', trades: ['roofing'], current_lat: 29.7504, current_lng: -95.3698 },
];

// Sample jobs for demo
const SAMPLE_JOBS: Job[] = [
  { id: 'job-1', title: 'AC Unit Repair', status: 'in_progress', address: '123 Main St, Houston, TX', client_id: { name: 'John Smith', phone: '555-1234' }, assigned_technician_id: '2' },
  { id: 'job-2', title: 'Electrical Panel Upgrade', status: 'scheduled', address: '456 Oak Ave, Houston, TX', client_id: { name: 'Jane Doe', phone: '555-5678' }, scheduled_date: '2026-03-20T14:00:00' },
  { id: 'job-3', title: 'Faucet Installation', status: 'lead', address: '789 Pine Rd, Houston, TX', client_id: { name: 'Bob Wilson', phone: '555-9012' } },
  { id: 'job-4', title: 'Roof Inspection', status: 'scheduled', address: '321 Elm St, Houston, TX', client_id: { name: 'Alice Brown', phone: '555-3456' }, scheduled_date: '2026-03-20T16:00:00' },
];

export default function DispatchPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [view, setView] = useState<'kanban' | 'map'>('kanban');
  const [loading, setLoading] = useState(true);
  
  // Drag state
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);

  // Column definitions
  const columns = [
    { id: 'lead', title: 'Leads', color: 'bg-gray-100' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-blue-50' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50' },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    
    // Set up simulated GPS polling for demo
    const interval = setInterval(() => {
      updateTechnicianLocations();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Try Directus first
    const techResult = await getTechnicians();
    const jobsResult = await getJobs();
    
    if (techResult.success && techResult.data && techResult.data.length > 0) {
      setTechnicians(techResult.data);
    } else {
      // Use sample data for demo
      setTechnicians(SAMPLE_TECHNICIANS);
    }
    
    if (jobsResult.success && jobsResult.data) {
      setJobs(jobsResult.data as Job[]);
    } else {
      // Use sample data for demo
      setJobs(SAMPLE_JOBS);
    }
    
    setLoading(false);
  };

  // Simulate GPS location updates
  const updateTechnicianLocations = () => {
    setTechnicians(prev => prev.map(tech => {
      if (tech.current_status === 'busy' || tech.current_status === 'available') {
        // Small random movement to simulate GPS drift
        const latOffset = (Math.random() - 0.5) * 0.001;
        const lngOffset = (Math.random() - 0.5) * 0.001;
        return {
          ...tech,
          current_lat: (tech.current_lat || 29.7604) + latOffset,
          current_lng: (tech.current_lng || -95.3698) + lngOffset,
        };
      }
      return tech;
    }));
  };

  // Handle job assignment
  const handleAssignJob = async (jobId: string, techId: string) => {
    const result = await assignJobToTechnician(jobId, techId);
    if (result.success) {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'scheduled', assigned_technician_id: techId } : job
      ));
      setTechnicians(prev => prev.map(tech => 
        tech.id === techId ? { ...tech, current_status: 'busy', current_job_id: jobId } : tech
      ));
    } else {
      // Update local state for demo
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'scheduled', assigned_technician_id: techId } : job
      ));
      setTechnicians(prev => prev.map(tech => 
        tech.id === techId ? { ...tech, current_status: 'busy', current_job_id: jobId } : tech
      ));
    }
    setSelectedJob(null);
    setSelectedTech(null);
  };

  // Handle job completion
  const handleCompleteJob = async (jobId: string, techId: string) => {
    const result = await completeJob(techId);
    if (result.success) {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'completed' } : job
      ));
      setTechnicians(prev => prev.map(tech => 
        tech.id === techId ? { ...tech, current_status: 'available', current_job_id: undefined } : tech
      ));
    } else {
      // Update local state for demo
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'completed' } : job
      ));
      setTechnicians(prev => prev.map(tech => 
        tech.id === techId ? { ...tech, current_status: 'available', current_job_id: undefined } : tech
      ));
    }
  };

  // Drag handlers (simplified without @dnd-kit for now)
  const handleDragStart = (job: Job) => {
    setDraggedJob(job);
  };

  const handleDrop = (status: string) => {
    if (draggedJob) {
      setJobs(prev => prev.map(job => 
        job.id === draggedJob.id ? { ...job, status: status as Job['status'] } : job
      ));
      setDraggedJob(null);
    }
  };

  // Get technician by ID
  const getTechById = (id: string) => technicians.find(t => t.id === id);

  // Group jobs by status
  const jobsByStatus = columns.reduce((acc, col) => {
    acc[col.id] = jobs.filter(job => job.status === col.id);
    return acc;
  }, {} as Record<string, Job[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dispatch Board</h1>
              <p className="text-sm text-gray-500">
                {technicians.filter(t => t.current_status === 'available').length} techs available · {' '}
                {jobs.filter(j => j.status === 'in_progress').length} jobs in progress
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 rounded-md ${view === 'kanban' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Kanban
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-4 py-2 rounded-md ${view === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : view === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {columns.map(col => (
              <div
                key={col.id}
                className={`${col.color} rounded-lg p-4 min-h-[400px]`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.id)}
              >
                <h3 className="font-semibold mb-3 flex items-center justify-between">
                  {col.title}
                  <span className="bg-white px-2 py-1 rounded text-sm">
                    {jobsByStatus[col.id]?.length || 0}
                  </span>
                </h3>
                <div className="space-y-3">
                  {jobsByStatus[col.id]?.map(job => {
                    const assignedTech = job.assigned_technician_id ? getTechById(job.assigned_technician_id) : null;
                    return (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={() => handleDragStart(job)}
                        onClick={() => setSelectedJob(job)}
                        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{job.address}</div>
                        {assignedTech && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                              {assignedTech.name.charAt(0)}
                            </div>
                            <span className="text-sm">{assignedTech.name}</span>
                          </div>
                        )}
                        {job.scheduled_date && (
                          <div className="mt-2 text-xs text-gray-400">
                            {new Date(job.scheduled_date).toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Placeholder */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <div className="text-lg font-medium text-gray-700">Interactive Map</div>
                <div className="text-sm text-gray-500 mt-2">
                  {technicians.length} technicians in the field
                </div>
                <div className="mt-4 space-y-2">
                  {technicians.filter(t => t.current_lat).map(tech => (
                    <div key={tech.id} className="text-sm text-gray-600">
                      {tech.name}: ({tech.current_lat?.toFixed(4)}, {tech.current_lng?.toFixed(4)}) - {' '}
                      <span className={`font-medium ${tech.current_status === 'available' ? 'text-green-600' : tech.current_status === 'busy' ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {tech.current_status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  Add Leaflet or Mapbox integration for full map view
                </div>
              </div>
            </div>

            {/* Technician List */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-4">Technicians</h3>
              <div className="space-y-3">
                {technicians.map(tech => (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTech(tech)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedTech?.id === tech.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-gray-500">{tech.trades.join(', ')}</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${tech.current_status === 'available' ? 'bg-green-500' : tech.current_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    </div>
                    {tech.current_job_id && (
                      <div className="mt-2 text-sm">
                        Working on: {jobs.find(j => j.id === tech.current_job_id)?.title || 'Unknown job'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && !draggedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedJob.title}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium capitalize">{selectedJob.status.replace('_', ' ')}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div className="font-medium">{selectedJob.address}</div>
              </div>
              
              {selectedJob.client_id && (
                <div>
                  <div className="text-sm text-gray-500">Client</div>
                  <div className="font-medium">
                    {typeof selectedJob.client_id === 'string' ? selectedJob.client_id : selectedJob.client_id.name}
                  </div>
                </div>
              )}
              
              {selectedJob.assigned_technician_id && (
                <div>
                  <div className="text-sm text-gray-500">Assigned To</div>
                  <div className="font-medium">{getTechById(selectedJob.assigned_technician_id)?.name || 'Unassigned'}</div>
                </div>
              )}
              
              {selectedJob.status === 'lead' && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-2">Assign Technician</div>
                  <div className="space-y-2">
                    {technicians.filter(t => t.current_status === 'available').map(tech => (
                      <button
                        key={tech.id}
                        onClick={() => handleAssignJob(selectedJob.id, tech.id)}
                        className="w-full text-left px-3 py-2 rounded border hover:bg-blue-50 transition-colors"
                      >
                        {tech.name} - {tech.trades.join(', ')}
                      </button>
                    ))}
                    {technicians.filter(t => t.current_status === 'available').length === 0 && (
                      <div className="text-sm text-gray-500">No available technicians</div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedJob.status === 'in_progress' && selectedJob.assigned_technician_id && (
                <button
                  onClick={() => handleCompleteJob(selectedJob.id, selectedJob.assigned_technician_id!)}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}