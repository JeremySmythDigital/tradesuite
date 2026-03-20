'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface Job {
  id: string;
  title: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  address: string;
  scheduled_date?: string;
  client_name: string;
  client_phone?: string;
  notes?: string;
}

interface Photo {
  id: string;
  jobId: string;
  url: string;
  caption: string;
  timestamp: string;
  synced: boolean;
}

// Sample jobs for demo
const SAMPLE_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'AC Unit Repair',
    status: 'in_progress',
    address: '123 Main St, Houston, TX 77001',
    scheduled_date: '2026-03-20T14:00:00',
    client_name: 'John Smith',
    client_phone: '555-1234',
    notes: 'Customer reports AC not cooling. Unit is 5 years old. Check refrigerant levels.',
  },
  {
    id: 'job-2',
    title: 'Electrical Panel Upgrade',
    status: 'scheduled',
    address: '456 Oak Ave, Houston, TX 77002',
    scheduled_date: '2026-03-20T16:00:00',
    client_name: 'Jane Doe',
    client_phone: '555-5678',
    notes: 'Upgrade from 100A to 200A panel. Customer has new EV charger.',
  },
  {
    id: 'job-3',
    title: 'Faucet Installation',
    status: 'scheduled',
    address: '789 Pine Rd, Houston, TX 77003',
    scheduled_date: '2026-03-21T09:00:00',
    client_name: 'Bob Wilson',
    client_phone: '555-9012',
    notes: 'Install new kitchen faucet. Customer will provide fixture.',
  },
];

export default function TechAppPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'jobs' | 'photos' | 'status'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [online, setOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
    updateLocation();
    
    // Set up periodic location updates
    const interval = setInterval(updateLocation, 60000);
    
    // Check online status
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchJobs = async () => {
    // In production, fetch from Directus/GHL
    // For demo, use sample data
    // Check IndexedDB for cached jobs first
    setJobs(SAMPLE_JOBS);
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error('Location error:', err);
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    }
  };

  // Update job status
  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
    
    // Sync with GHL when online
    if (online) {
      // TODO: Sync with GHL API
      console.log('Syncing status change with GHL:', { jobId, newStatus });
    }
  };

  // Handle photo capture
  const handlePhotoCapture = async (jobId: string) => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newPhoto: Photo = {
            id: Date.now().toString(),
            jobId,
            url: reader.result as string,
            caption: '',
            timestamp: new Date().toISOString(),
            synced: online,
          };
          setPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  // Add caption to photo
  const handleAddCaption = (photoId: string, caption: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, caption } : p
    ));
  };

  // Get jobs by status
  const jobsByStatus = {
    scheduled: jobs.filter(j => j.status === 'scheduled'),
    in_progress: jobs.filter(j => j.status === 'in_progress'),
    completed: jobs.filter(j => j.status === 'completed'),
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Cypress Signal</h1>
            <div className="text-sm opacity-90">
              {online ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
          {currentLocation && (
            <div className="text-xs opacity-75">
              📍 {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      {/* Active Job Banner */}
      {jobsByStatus.in_progress.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-yellow-800">Active Job</div>
              <div className="text-sm">{jobsByStatus.in_progress[0].title}</div>
            </div>
            <button
              onClick={() => setSelectedJob(jobsByStatus.in_progress[0])}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">My Jobs</h2>
            
            {/* In Progress */}
            {jobsByStatus.in_progress.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                {jobsByStatus.in_progress.map(job => (
                  <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                ))}
              </div>
            )}
            
            {/* Scheduled */}
            {jobsByStatus.scheduled.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
                {jobsByStatus.scheduled.map(job => (
                  <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                ))}
              </div>
            )}
            
            {/* Completed */}
            {jobsByStatus.completed.length > 0 && (
              <details className="space-y-2">
                <summary className="text-sm font-medium text-gray-500 cursor-pointer">
                  Completed ({jobsByStatus.completed.length})
                </summary>
                {jobsByStatus.completed.map(job => (
                  <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                ))}
              </details>
            )}
            
            {jobs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No jobs assigned
              </div>
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Photos</h2>
            
            {selectedJob ? (
              <>
                <div className="flex justify-between items-center">
                  <button onClick={() => setSelectedJob(null)} className="text-blue-600">
                    ← Back
                  </button>
                  <button
                    onClick={() => handlePhotoCapture(selectedJob.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    📷 Add Photo
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">{selectedJob.title}</div>
                
                {photos.filter(p => p.jobId === selectedJob.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No photos yet. Tap "Add Photo" to capture job photos.
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  {photos.filter(p => p.jobId === selectedJob.id).map(photo => (
                    <div key={photo.id} className="relative">
                      <img src={photo.url} alt="Job photo" className="w-full aspect-square object-cover rounded-lg" />
                      {!photo.synced && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Pending Sync
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Add caption..."
                        value={photo.caption}
                        onChange={(e) => handleAddCaption(photo.id, e.target.value)}
                        className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  {jobsByStatus.in_progress.concat(jobsByStatus.scheduled).map(job => {
                    const jobPhotos = photos.filter(p => p.jobId === job.id);
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{job.title}</div>
                            <div className="text-sm text-gray-500">{jobPhotos.length} photos</div>
                          </div>
                          <div className="text-blue-600">→</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Status Updates</h2>
            
            {selectedJob ? (
              <div className="space-y-4">
                <button onClick={() => setSelectedJob(null)} className="text-blue-600">
                  ← Back to jobs
                </button>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium mb-2">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{selectedJob.address}</p>
                  
                  <div className="space-y-4">
                    {selectedJob.status === 'scheduled' && (
                      <button
                        onClick={() => handleStatusChange(selectedJob.id, 'in_progress')}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium"
                      >
                        Start Job
                      </button>
                    )}
                    
                    {selectedJob.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(selectedJob.id, 'completed')}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
                        >
                          Complete Job
                        </button>
                        
                        <button
                          onClick={() => {
                            setActiveTab('photos');
                            setSelectedJob(null);
                          }}
                          className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
                        >
                          Add Photos
                        </button>
                      </>
                    )}
                    
                    {selectedJob.status === 'completed' && (
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">✓</div>
                        <div className="font-medium text-green-600">Job Completed</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedJob.notes && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Notes</div>
                    <p className="text-gray-700">{selectedJob.notes}</p>
                  </div>
                )}
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">Contact Customer</div>
                  {selectedJob.client_phone && (
                    <a
                      href={`tel:${selectedJob.client_phone}`}
                      className="block bg-green-100 text-green-800 py-2 text-center rounded-lg mb-2"
                    >
                      📞 Call {selectedJob.client_name}
                    </a>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedJob.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-blue-100 text-blue-800 py-2 text-center rounded-lg"
                  >
                    📍 Navigate to Job
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.filter(j => j.status !== 'completed').map(job => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-500 capitalize">{job.status.replace('_', ' ')}</div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex">
        <button
          onClick={() => { setActiveTab('jobs'); setSelectedJob(null); }}
          className={`flex-1 py-3 ${activeTab === 'jobs' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
        >
          📋 Jobs
        </button>
        <button
          onClick={() => { setActiveTab('photos'); setSelectedJob(null); }}
          className={`flex-1 py-3 ${activeTab === 'photos' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
        >
          📷 Photos
        </button>
        <button
          onClick={() => { setActiveTab('status'); setSelectedJob(null); }}
          className={`flex-1 py-3 ${activeTab === 'status' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
        >
          ✓ Status
        </button>
      </nav>
    </div>
  );
}

// Job Card Component
function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-gray-500 mt-1">{job.address}</div>
          {job.scheduled_date && (
            <div className="text-xs text-gray-400 mt-1">
              {new Date(job.scheduled_date).toLocaleString()}
            </div>
          )}
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${job.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : job.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
          {job.status.replace('_', ' ')}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <span>👤 {job.client_name}</span>
        {job.client_phone && <span>📞 {job.client_phone}</span>}
      </div>
    </div>
  );
}