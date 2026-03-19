'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
interface Job {
  id: string;
  type: 'service_call' | 'panel_upgrade' | 'inspection' | 'remodel';
  customer: string;
  phone: string;
  address: string;
  value: number;
  urgency: 'emergency' | 'scheduled' | 'flexible';
  daysOld: number;
  notes: string;
}

interface LostRevenue {
  reason: string;
  amount: number;
  job: string;
}

type GamePhase = 'intro' | 'chaos' | 'transition' | 'tradesuite' | 'results';

const JOB_TYPES: Record<string, { label: string; basePrice: number; time: number }> = {
  service_call: { label: 'Service Call', basePrice: 189, time: 2 },
  panel_upgrade: { label: 'Panel Upgrade', basePrice: 2400, time: 8 },
  inspection: { label: 'Inspection', basePrice: 225, time: 1 },
  remodel: { label: 'Remodel Wiring', basePrice: 7200, time: 40 },
};

const CUSTOMERS = [
  { name: 'Johnson', phone: '555-0101', address: '123 Main St' },
  { name: 'Williams', phone: '555-0102', address: '456 Oak Ave' },
  { name: 'Garcia', phone: '555-0103', address: '789 Elm Blvd' },
  { name: 'Brown', phone: '555-0104', address: '321 Pine Lane' },
  { name: 'Martinez', phone: '555-0105', address: '654 Maple Dr' },
  { name: 'Miller', phone: '555-0106', address: '987 Cedar Ct' },
];

const NOTES = [
  'Customer called about outlet not working',
  'Wants quote for 200 amp panel',
  'Annual inspection due',
  'Kitchen remodel - need rough-in',
  'Lights flickering in living room',
  'Need estimate for new circuit',
];

function generateJobs(day: number): Job[] {
  const jobs: Job[] = [];
  const types = Object.keys(JOB_TYPES);
  const count = Math.min(3 + Math.floor(day / 2), 8);
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)] as Job['type'];
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const urgency: Job['urgency'] = Math.random() > 0.8 ? 'emergency' : Math.random() > 0.5 ? 'scheduled' : 'flexible';
    const multiplier = urgency === 'emergency' ? 1.5 : 1;
    
    jobs.push({
      id: `job-${day}-${i}`,
      type,
      customer: customer.name,
      phone: customer.phone,
      address: customer.address,
      value: Math.round(JOB_TYPES[type].basePrice * multiplier),
      urgency,
      daysOld: Math.floor(Math.random() * 3),
      notes: NOTES[Math.floor(Math.random() * NOTES.length)],
    });
  }
  
  return jobs;
}

export default function ElectricianGame() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [day, setDay] = useState(1);
  const [chaosJobs, setChaosJobs] = useState<Job[]>([]);
  const [tradesuiteJobs, setTradesuiteJobs] = useState<Job[]>([]);
  const [chaosRevenue, setChaosRevenue] = useState(0);
  const [tradesuiteRevenue, setTradesuiteRevenue] = useState(0);
  const [lostRevenue, setLostRevenue] = useState<LostRevenue[]>([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [completedJobs, setCompletedJobs] = useState<string[]>([]);
  const [missedEmergency, setMissedEmergency] = useState(false);

  // Initialize chaos jobs
  useEffect(() => {
    if (phase === 'chaos' && chaosJobs.length === 0) {
      setChaosJobs(generateJobs(1));
    }
    if (phase === 'tradesuite' && tradesuiteJobs.length === 0) {
      setTradesuiteJobs(generateJobs(1));
    }
  }, [phase]);

  // Calculate what's visible (chaos mode = disorganized)
  const visibleChaosJobs = chaosJobs.filter(job => 
    searchTerm === '' || 
    job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chaos mode: Complete a job
  const handleChaosComplete = (job: Job) => {
    if (job.urgency === 'emergency') {
      // Emergency jobs in chaos mode might have been missed
      const hoursSinceCall = job.daysOld * 24 + Math.random() * 12;
      if (hoursSinceCall > 4) {
        setMissedEmergency(true);
        setLostRevenue(prev => [...prev, {
          reason: 'Emergency call went to voicemail - customer called competitor',
          amount: job.value,
          job: job.customer,
        }]);
        setChaosJobs(prev => prev.filter(j => j.id !== job.id));
        setMessage(`You lost ${job.customer} - they called someone else while you were searching.`);
        return;
      }
    }
    
    setChaosRevenue(prev => prev + job.value);
    setCompletedJobs(prev => [...prev, job.id]);
    setChaosJobs(prev => prev.filter(j => j.id !== job.id));
    setMessage(`✅ Completed ${JOB_TYPES[job.type].label} for ${job.customer} - $${job.value.toLocaleString()}`);
  };

  // Chaos mode: Skip a job
  const handleChaosSkip = (jobId: string) => {
    const job = chaosJobs.find(j => j.id === jobId);
    if (job) {
      setLostRevenue(prev => [...prev, {
        reason: 'Skipped - forgot to follow up',
        amount: Math.round(job.value * 0.3),
        job: job.customer,
      }]);
    }
    setChaosJobs(prev => prev.filter(j => j.id !== jobId));
    setMessage('Job skipped. Customer will call someone else.');
  };

  // Next day (chaos mode)
  const handleChaosNextDay = () => {
    // Count lost opportunities
    chaosJobs.forEach(job => {
      if (job.urgency === 'emergency' && job.daysOld >= 1) {
        setLostRevenue(prev => [...prev, {
          reason: 'Lost emergency call to competitor',
          amount: job.value,
          job: job.customer,
        }]);
      } else if (Math.random() > 0.7) {
        setLostRevenue(prev => [...prev, {
          reason: 'Customer went with faster responder',
          amount: Math.round(job.value * 0.5),
          job: job.customer,
        }]);
      }
    });

    if (day >= 5) {
      setPhase('transition');
      return;
    }

    setDay(prev => prev + 1);
    setChaosJobs(prev => [...prev.filter(j => j.daysOld <= 1), ...generateJobs(day + 1)]);
  };

  // TradeSuite mode: Complete a job
  const handleTradesuiteComplete = (job: Job) => {
    setTradesuiteRevenue(prev => prev + job.value);
    setTradesuiteJobs(prev => prev.filter(j => j.id !== job.id));
    setMessage(`✅ ${job.urgency === 'emergency' ? '⚡ URGENT - Called immediately! ' : ''}Completed ${JOB_TYPES[job.type].label} for ${job.customer} - $${job.value.toLocaleString()}`);
  };

  // Next day (TradeSuite)
  const handleTradesuiteNextDay = () => {
    if (day >= 5) {
      setPhase('results');
      return;
    }
    setDay(prev => prev + 1);
    setTradesuiteJobs(prev => [...prev.filter(j => j.daysOld <= 1), ...generateJobs(day + 1)]);
  };

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚡ The Electrician's Dilemma</h1>
          <p className="text-gray-600 mb-6">A 5-day simulation comparing spreadsheet chaos vs TradeSuite</p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <h3 className="font-bold text-red-800 mb-2">📋 The Problem:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              <li>• Calls come in fast - how do you prioritize?</li>
              <li>• Emergency calls get lost in notes</li>
              <li>• Forgetting to invoice = lost revenue</li>
              <li>• Client info scattered across apps</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="font-bold text-blue-800 mb-2">🎯 Your Mission:</h3>
            <p className="text-blue-700 text-sm">
              Run your electrical business for 5 days. First, try managing jobs with scattered notes. 
              Then see how TradeSuite makes it effortless.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-2">Phase 1: Chaos</h4>
              <p className="text-sm text-gray-600">Manage jobs manually. Search through notes. Miss opportunities.</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">Phase 2: TradeSuite</h4>
              <p className="text-sm text-green-600">Same jobs, organized. See everything at a glance.</p>
            </div>
          </div>

          <button
            onClick={() => setPhase('chaos')}
            className="w-full px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-yellow-700 transition-colors"
          >
            Start Day 1 →
          </button>
        </div>
      </div>
    );
  }

  // Chaos Phase
  if (phase === 'chaos') {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">📱 Your Phone Notes App</h1>
              <p className="text-gray-400 text-sm">Day {day} of 5 - Managing jobs manually</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${chaosRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Revenue</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-blue-900 border-b border-blue-700 p-3 text-center text-blue-200 text-sm">
            {message}
          </div>
        )}

        <div className="max-w-7xl mx-auto p-4">
          {/* Search bar - manual feel */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">🔍 Search your notes:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Try finding 'Johnson' or 'emergency'..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            {searchTerm && (
              <p className="text-xs text-yellow-400 mt-2">
                Showing {visibleChaosJobs.length} of {chaosJobs.length} jobs
              </p>
            )}
          </div>

          {/* Lost Revenue Warning */}
          {lostRevenue.length > 0 && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-red-200 mb-2">💸 Lost Revenue This Week</h3>
              <ul className="text-sm text-red-300 space-y-1">
                {lostRevenue.slice(-3).map((loss, i) => (
                  <li key={i}>• {loss.reason}: -${loss.amount.toLocaleString()}</li>
                ))}
                <li className="font-bold text-red-100 pt-2">
                  Total Lost: ${lostRevenue.reduce((sum, l) => sum + l.amount, 0).toLocaleString()}
                </li>
              </ul>
            </div>
          )}

          {/* Jobs - scattered notes style */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-400 text-sm font-medium">
                📝 Job Notes ({chaosJobs.length} active)
              </h2>
              <span className="text-gray-500 text-xs">Tap to select, then choose action</span>
            </div>

            {chaosJobs.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
                No jobs in your notes. Click "Next Day" to continue.
              </div>
            ) : (
              visibleChaosJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedJob?.id === job.id ? 'ring-2 ring-yellow-500' : ''
                  } ${job.urgency === 'emergency' ? 'border-l-4 border-red-500' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {job.urgency === 'emergency' && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-medium">
                            ⚡ URGENT
                          </span>
                        )}
                        <span className="text-white font-medium">{job.customer}</span>
                        <span className="text-gray-500 text-xs">{job.daysOld > 0 ? `(${job.daysOld}d old)` : ''}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{job.notes}</p>
                      <p className="text-gray-500 text-xs mt-1">{JOB_TYPES[job.type].label} • ${job.value.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          {selectedJob && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
              <div className="max-w-7xl mx-auto">
                <div className="bg-gray-700 rounded-lg p-3 mb-3">
                  <p className="text-white font-medium">{selectedJob.customer} - {JOB_TYPES[selectedJob.type].label}</p>
                  <p className="text-gray-400 text-sm">{selectedJob.phone} • {selectedJob.address}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleChaosComplete(selectedJob)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    ✓ Complete Job (${selectedJob.value.toLocaleString()})
                  </button>
                  <button
                    onClick={() => handleChaosSkip(selectedJob.id)}
                    className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Next Day Button */}
          {!selectedJob && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-gray-400">
                  <p className="text-sm">Day {day}/5</p>
                  <p className="text-xs">Chaos Mode</p>
                </div>
                <button
                  onClick={handleChaosNextDay}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700"
                >
                  Next Day →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Transition Phase
  if (phase === 'transition') {
    const lost = lostRevenue.reduce((sum, l) => sum + l.amount, 0);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📊 5 Days of Chaos: Results</h1>
          
          <div className="bg-red-50 rounded-xl p-6 mb-6">
            <p className="text-red-600 mb-2">Revenue Captured:</p>
            <p className="text-4xl font-bold text-green-600">${chaosRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-gray-600 mb-2">Revenue Lost to Chaos:</p>
            <p className="text-4xl font-bold text-red-600">${lost.toLocaleString()}</p>
            <ul className="text-left text-sm text-gray-600 mt-3 space-y-1">
              {lostRevenue.map((l, i) => (
                <li key={i}>• {l.reason}</li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-left">
            <h3 className="font-bold text-yellow-800 mb-2">💡 What went wrong:</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Emergency calls mixed with routine jobs</li>
              <li>• No automatic reminders for follow-ups</li>
              <li>• Lost track of customer contact info</li>
              <li>• Spending time searching instead of working</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">Now let's try the same 5 days with TradeSuite...</p>

          <button
            onClick={() => {
              setDay(1);
              setPhase('tradesuite');
            }}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Try TradeSuite →
          </button>
        </div>
      </div>
    );
  }

  // TradeSuite Phase
  if (phase === 'tradesuite') {
    // Emergency jobs first
    const sortedJobs = [...tradesuiteJobs].sort((a, b) => {
      if (a.urgency === 'emergency' && b.urgency !== 'emergency') return -1;
      if (a.urgency !== 'emergency' && b.urgency === 'emergency') return 1;
      return 0;
    });

    // Stats calculation
    const emergencyCount = tradesuiteJobs.filter(j => j.urgency === 'emergency').length;
    const totalValue = tradesuiteJobs.reduce((sum, j) => sum + j.value, 0);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header - Clean TradeSuite Style */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-xl">TradeSuite</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">${tradesuiteRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Day {day}/5
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Active Jobs</p>
              <p className="text-2xl font-bold">{tradesuiteJobs.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Emergency</p>
              <p className={`text-2xl font-bold ${emergencyCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {emergencyCount} {emergencyCount > 0 ? '⚡' : '✓'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Pipeline Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Day Progress</p>
              <p className="text-2xl font-bold">{day}/5</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
              {message}
            </div>
          </div>
        )}

        {/* Jobs Board */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg">📋 Job Board</h2>
              <p className="text-sm text-gray-500">
                {emergencyCount > 0 ? (
                  <span className="text-red-600 font-medium">⚡ {emergencyCount} urgent job{emergencyCount > 1 ? 's' : ''} need{emergencyCount === 1 ? 's' : ''} immediate attention</span>
                ) : (
                  <span className="text-green-600">All caught up! No urgent jobs.</span>
                )}
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {sortedJobs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No active jobs. Click "Next Day" to continue.
                </div>
              ) : (
                sortedJobs.map((job) => (
                  <div key={job.id} className={`p-4 ${job.urgency === 'emergency' ? 'bg-red-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {job.urgency === 'emergency' && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-medium animate-pulse">
                              ⚡ URGENT - Call Immediately
                            </span>
                          )}
                          <span className="font-medium">{JOB_TYPES[job.type].label}</span>
                        </div>
                        <p className="text-gray-900 font-medium">{job.customer}</p>
                        <p className="text-gray-500 text-sm">{job.address}</p>
                        <p className="text-gray-400 text-xs">{job.phone} • {job.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">${job.value.toLocaleString()}</p>
                        <button
                          onClick={() => handleTradesuiteComplete(job)}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          Complete & Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                ✓ Auto-sorted by urgency
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                ✓ One-click invoicing
              </div>
            </div>
            <button
              onClick={handleTradesuiteNextDay}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Next Day →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Phase
  if (phase === 'results') {
    const chaosLost = lostRevenue.reduce((sum, l) => sum + l.amount, 0);
    const efficiency = Math.round(((tradesuiteRevenue - chaosRevenue + chaosLost) / Math.max(chaosRevenue, 1)) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">📊 Final Results</h1>
          <p className="text-gray-600 text-center mb-8">5 days of chaos vs 5 days with TradeSuite</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Chaos Results */}
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-600 mb-4 text-center">Without TradeSuite</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue Captured:</span>
                  <span className="font-bold text-green-600">${chaosRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue Lost:</span>
                  <span className="font-bold text-red-600">-${chaosLost.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Opportunities Missed:</span>
                    <span className="font-bold text-red-600">{lostRevenue.length} jobs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TradeSuite Results */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-500">
              <h3 className="font-bold text-blue-800 mb-4 text-center">With TradeSuite</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Revenue Captured:</span>
                  <span className="font-bold text-green-600">${tradesuiteRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Revenue Lost:</span>
                  <span className="font-bold text-green-600">$0</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Opportunities Missed:</span>
                    <span className="font-bold text-green-600">0 jobs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Improvement */}
          <div className="bg-green-50 rounded-xl p-6 mb-8 text-center">
            <p className="text-gray-600 mb-2">TradeSuite Improvement:</p>
            <p className="text-5xl font-bold text-green-600">
              +${(tradesuiteRevenue - chaosRevenue + chaosLost).toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {efficiency > 0 ? `${efficiency}% more revenue captured` : 'Same revenue, less stress'}
            </p>
          </div>

          {/* What TradeSuite Does */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">What TradeSuite Does:</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Emergency calls highlighted</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> All client info in one place</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> One-click estimates & invoices</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Automatic follow-up reminders</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Job scheduling calendar</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Revenue tracking dashboard</li>
            </ul>
          </div>

          <div className="text-center">
            <Link
              href="/signup?trade=electrician&source=game"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial →
            </Link>
            <p className="text-gray-500 text-sm mt-3">$29/month • No credit card required • Cancel anytime</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}