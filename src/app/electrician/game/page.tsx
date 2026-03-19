'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  type: 'service_call' | 'panel_upgrade' | 'inspection' | 'remodel';
  customer: string;
  phone: string;
  address: string;
  value: number;
  urgency: 'emergency' | 'scheduled' | 'flexible';
  description: string;
}

type GamePhase = 'intro' | 'chaos' | 'transition' | 'tradesuite' | 'results';

const JOB_TYPES: Record<string, { label: string; basePrice: number; time: number }> = {
  service_call: { label: 'Service Call', basePrice: 189, time: 2 },
  panel_upgrade: { label: 'Panel Upgrade', basePrice: 2400, time: 8 },
  inspection: { label: 'Inspection', basePrice: 225, time: 1 },
  remodel: { label: 'Remodel Wiring', basePrice: 7200, time: 40 },
};

const CUSTOMERS = [
  { name: 'Johnson Residence', phone: '555-0101', address: '123 Main St' },
  { name: 'Williams Property', phone: '555-0102', address: '456 Oak Ave' },
  { name: 'Garcia Home', phone: '555-0103', address: '789 Elm Blvd' },
  { name: 'Brown Residence', phone: '555-0104', address: '321 Pine Lane' },
  { name: 'Martinez Family', phone: '555-0105', address: '654 Maple Dr' },
  { name: 'Miller House', phone: '555-0106', address: '987 Cedar Ct' },
  { name: 'Davis Estate', phone: '555-0107', address: '147 Birch Way' },
  { name: 'Wilson Property', phone: '555-0108', address: '258 Willow Rd' },
];

const DESCRIPTIONS = [
  'Customer reported outlet not working',
  'Needs 200 amp panel upgrade quote',
  'Annual safety inspection due',
  'Kitchen remodel - need rough-in estimate',
  'Lights flickering in living room',
  'Adding circuit for new AC unit',
  'Whole house surge protector install',
  'Ceiling fan installation needed',
  'Outdoor outlets not working',
  'Breaker tripping frequently',
];

function generateJob(): Job {
  const types = Object.keys(JOB_TYPES) as Job['type'][];
  const type = types[Math.floor(Math.random() * types.length)];
  const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
  const urgency: Job['urgency'] = Math.random() > 0.8 ? 'emergency' : Math.random() > 0.5 ? 'scheduled' : 'flexible';
  const multiplier = urgency === 'emergency' ? 1.5 : 1;
  
  return {
    id: Math.random().toString(36).substring(7),
    type,
    customer: customer.name,
    phone: customer.phone,
    address: customer.address,
    value: Math.round(JOB_TYPES[type].basePrice * multiplier),
    urgency,
    description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
  };
}

function generateDayJobs(count: number): Job[] {
  return Array.from({ length: count }, generateJob);
}

function addJobId(prev: Set<string>, id: string): Set<string> {
  const next = new Set<string>(prev);
  next.add(id);
  return next;
}

export default function ElectricianGame() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [day, setDay] = useState(1);
  const [chaosJobs, setChaosJobs] = useState<Job[]>([]);
  const [tradesuiteJobs, setTradesuiteJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Set<string>>(new Set());
  const [chaosRevenue, setChaosRevenue] = useState(0);
  const [tradesuiteRevenue, setTradesuiteRevenue] = useState(0);
  const [lostRevenue, setLostRevenue] = useState<{ reason: string; amount: number }[]>([]);
  const [message, setMessage] = useState('');
  const [showDaySummary, setShowDaySummary] = useState(false);
  const [dayResults, setDayResults] = useState<{ completed: number; revenue: number; lost: number } | null>(null);

  useEffect(() => {
    if (phase === 'chaos' && chaosJobs.length === 0) {
      setChaosJobs(generateDayJobs(4));
      setCompletedJobs(new Set());
    }
    if (phase === 'tradesuite' && tradesuiteJobs.length === 0) {
      setTradesuiteJobs(generateDayJobs(4));
      setCompletedJobs(new Set());
    }
  }, [phase]);

  const remainingChaosJobs = chaosJobs.filter(j => !completedJobs.has(j.id));
  const remainingTradesuiteJobs = tradesuiteJobs.filter(j => !completedJobs.has(j.id));

  const handleChaosComplete = (job: Job) => {
    if (completedJobs.has(job.id)) return;
    
    setCompletedJobs(prev => addJobId(prev, job.id));
    setChaosRevenue(prev => prev + job.value);
    setMessage(`✓ Completed ${JOB_TYPES[job.type].label} for $${job.value.toLocaleString()}`);
  };

  const handleChaosSkip = (job: Job) => {
    if (completedJobs.has(job.id)) return;
    
    setCompletedJobs(prev => addJobId(prev, job.id));
    const lost = Math.round(job.value * 0.3);
    setLostRevenue(prev => [...prev, { reason: `Skipped ${job.customer}`, amount: lost }]);
    setMessage(`⚠ Lost ${job.customer} - they called someone else`);
  };

  const handleChaosEndDay = () => {
    const unfinished = remainingChaosJobs;
    let dayLost = 0;
    
    unfinished.forEach(job => {
      if (job.urgency === 'emergency') {
        setLostRevenue(prev => [...prev, { 
          reason: `Missed emergency: ${job.customer}`, 
          amount: job.value 
        }]);
        dayLost += job.value;
      } else {
        if (Math.random() > 0.7) {
          setLostRevenue(prev => [...prev, { 
            reason: `${job.customer} went elsewhere`, 
            amount: Math.round(job.value * 0.5) 
          }]);
          dayLost += Math.round(job.value * 0.5);
        }
      }
    });

    setDayResults({
      completed: 4 - remainingChaosJobs.length,
      revenue: chaosRevenue,
      lost: dayLost,
    });
    setShowDaySummary(true);
  };

  const handleChaosNextDay = () => {
    setShowDaySummary(false);
    setMessage('');
    
    if (day >= 5) {
      setPhase('transition');
      return;
    }
    
    setDay(prev => prev + 1);
    setChaosJobs(generateDayJobs(4));
    setCompletedJobs(new Set());
  };

  const handleTradesuiteComplete = (job: Job) => {
    if (completedJobs.has(job.id)) return;
    
    setCompletedJobs(prev => addJobId(prev, job.id));
    setTradesuiteRevenue(prev => prev + job.value);
    
    const bonus = job.urgency === 'emergency' ? ' (⚡ Emergency bonus included!)' : '';
    setMessage(`✓ Completed ${JOB_TYPES[job.type].label} for ${job.customer} - $${job.value.toLocaleString()}${bonus}`);
  };

  const handleTradesuiteEndDay = () => {
    setDayResults({
      completed: 4 - remainingTradesuiteJobs.length,
      revenue: tradesuiteRevenue,
      lost: 0,
    });
    setShowDaySummary(true);
  };

  const handleTradesuiteNextDay = () => {
    setShowDaySummary(false);
    setMessage('');
    
    if (day >= 5) {
      setPhase('results');
      return;
    }
    
    setDay(prev => prev + 1);
    setTradesuiteJobs(generateDayJobs(4));
    setCompletedJobs(new Set());
  };

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚡ The Electrician&apos;s Dilemma</h1>
          <p className="text-gray-600 mb-6">A 5-day simulation comparing spreadsheet chaos vs TradeSuite</p>
          
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-2">📋 How This Works:</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Receive 4 jobs per day</strong> - Choose which to complete or skip</li>
              <li><strong>Emergency jobs</strong> - Must complete same day or lose customer</li>
              <li><strong>Day 1-5: Chaos Mode</strong> - Manage jobs manually</li>
              <li><strong>Day 6-10: TradeSuite</strong> - Same scenario, organized</li>
              <li><strong>Compare results</strong> - See the difference</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-1">Chaos Mode</h4>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Jobs unsorted</li>
                <li>• Easy to miss emergencies</li>
                <li>• Lose jobs to competitors</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-1">TradeSuite</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Urgent jobs highlighted</li>
                <li>• All info visible</li>
                <li>• Never miss a job</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setPhase('chaos')}
            className="w-full px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-yellow-700 transition-colors"
          >
            Start Day 1 (Chaos Mode) →
          </button>
        </div>
      </div>
    );
  }

  // Day Summary Modal
  if (showDaySummary && dayResults) {
    const isChaos = phase === 'chaos';
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isChaos ? `Day ${day} Complete (Chaos Mode)` : `Day ${day} Complete`}
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Jobs Completed:</span>
              <span className="font-bold text-lg">{dayResults.completed}/4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue:</span>
              <span className="font-bold text-lg text-green-600">${dayResults.revenue.toLocaleString()}</span>
            </div>
            {isChaos && dayResults.lost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lost:</span>
                <span className="font-bold text-lg text-red-600">-${dayResults.lost.toLocaleString()}</span>
              </div>
            )}
            {!isChaos && (
              <div className="bg-green-50 rounded-lg p-3 text-center text-green-700 text-sm">
                ✓ All jobs captured, none lost
              </div>
            )}
          </div>

          <button
            onClick={isChaos ? handleChaosNextDay : handleTradesuiteNextDay}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            {day >= 5 ? 'See Final Results →' : `Start Day ${day + 1} →`}
          </button>
        </div>
      </div>
    );
  }

  // Chaos Phase
  if (phase === 'chaos') {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="bg-gray-800 text-white p-4 sticky top-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">📱 Your Phone Notes</h1>
              <p className="text-gray-400 text-sm">Day {day} of 5 • Chaos Mode</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${chaosRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Revenue</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-blue-900 border-b border-blue-700 p-3 text-center text-blue-200 text-sm">
            {message}
          </div>
        )}

        <div className="max-w-4xl mx-auto p-4 pb-8">
          <div className="bg-gray-800 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-gray-400">Jobs remaining: {remainingChaosJobs.length}/4</span>
            <button
              onClick={handleChaosEndDay}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700"
            >
              End Day {day} →
            </button>
          </div>

          {lostRevenue.length > 0 && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm">
                💸 Lost Revenue: ${lostRevenue.reduce((sum, l) => sum + l.amount, 0).toLocaleString()}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-gray-400 text-sm font-medium">
              📝 Job Notes ({remainingChaosJobs.length} remaining)
            </h2>

            {remainingChaosJobs.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-green-400 text-xl mb-2">✓ All jobs processed!</p>
                <p className="text-gray-500 mb-4">Ready to end the day</p>
                <button
                  onClick={handleChaosEndDay}
                  className="px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold text-lg hover:bg-yellow-700"
                >
                  End Day {day} →
                </button>
              </div>
            ) : (
              remainingChaosJobs.map((job) => (
                <div 
                  key={job.id} 
                  className={`bg-gray-800 rounded-lg p-4 ${
                    job.urgency === 'emergency' ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {job.urgency === 'emergency' && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-medium mr-2">
                          ⚡ URGENT
                        </span>
                      )}
                      <span className="text-white font-medium">{JOB_TYPES[job.type].label}</span>
                    </div>
                    <span className="text-green-400 font-bold">${job.value.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-300 font-medium">{job.customer}</p>
                  <p className="text-gray-500 text-sm">{job.phone} • {job.address}</p>
                  <p className="text-gray-400 text-sm mt-1">{job.description}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleChaosComplete(job)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleChaosSkip(job)}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-3">
          <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
            Day {day}/5 Chaos Mode • Complete or skip jobs, then end the day
          </div>
        </div>
      </div>
    );
  }

  // Transition Phase
  if (phase === 'transition') {
    const chaosLost = lostRevenue.reduce((sum, l) => sum + l.amount, 0);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">5 Days of Chaos</h1>
          
          <div className="bg-red-50 rounded-xl p-6 mb-6">
            <p className="text-red-600 text-sm mb-1">Total Revenue</p>
            <p className="text-4xl font-bold text-green-600">${chaosRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gray-100 rounded-xl p-6 mb-6">
            <p className="text-gray-600 text-sm mb-1">Lost to Chaos</p>
            <p className="text-4xl font-bold text-red-600">-${chaosLost.toLocaleString()}</p>
            <div className="mt-3 text-left text-sm text-gray-600 max-h-32 overflow-y-auto">
              {lostRevenue.map((l, i) => (
                <p key={i}>• {l.reason}: -${l.amount.toLocaleString()}</p>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium text-yellow-800 mb-2">What happened:</p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Emergency calls got buried in notes</li>
              <li>• Had to scroll/search to find details</li>
              <li>• No reminders to follow up</li>
              <li>• Lost customers to faster responders</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">Now let&apos;s try with TradeSuite...</p>
          
          <button
            onClick={() => {
              setDay(1);
              setPhase('tradesuite');
            }}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700"
          >
            Try TradeSuite →
          </button>
        </div>
      </div>
    );
  }

  // TradeSuite Phase
  if (phase === 'tradesuite') {
    const sortedJobs = [...remainingTradesuiteJobs].sort((a, b) => {
      if (a.urgency === 'emergency' && b.urgency !== 'emergency') return -1;
      if (a.urgency !== 'emergency' && b.urgency === 'emergency') return 1;
      return 0;
    });

    const emergencyCount = remainingTradesuiteJobs.filter(j => j.urgency === 'emergency').length;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
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

        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <p className="text-xs text-gray-500">Active Jobs</p>
              <p className="text-xl font-bold">{remainingTradesuiteJobs.length}</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <p className="text-xs text-gray-500">Urgent</p>
              <p className={`text-xl font-bold ${emergencyCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {emergencyCount} {emergencyCount > 0 ? '⚡' : '✓'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <p className="text-xs text-gray-500">Lost Revenue</p>
              <p className="text-xl font-bold text-green-600">$0</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="max-w-4xl mx-auto px-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
              {message}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="mb-4 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div>
              <h2 className="font-bold">Job Board</h2>
              {emergencyCount > 0 ? (
                <p className="text-red-600 text-sm font-medium">⚡ {emergencyCount} urgent job{emergencyCount > 1 ? 's' : ''} - complete first!</p>
              ) : (
                <p className="text-green-600 text-sm">All caught up! Ready to end the day.</p>
              )}
            </div>
            <button
              onClick={handleTradesuiteEndDay}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              End Day {day} →
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {sortedJobs.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-green-600 text-xl mb-2">✓ Day Complete!</p>
                  <p className="text-gray-500 mb-4">Great work! End the day to continue.</p>
                </div>
              ) : (
                sortedJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className={`p-4 ${job.urgency === 'emergency' ? 'bg-red-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {job.urgency === 'emergency' && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-medium animate-pulse">
                              ⚡ URGENT
                            </span>
                          )}
                          <span className="font-medium">{JOB_TYPES[job.type].label}</span>
                        </div>
                        <p className="font-medium text-gray-900">{job.customer}</p>
                        <p className="text-gray-500 text-sm">{job.phone} • {job.address}</p>
                        <p className="text-gray-400 text-sm">{job.description}</p>
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

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
          <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
            TradeSuite Mode • Day {day}/5
          </div>
        </div>
      </div>
    );
  }

  // Results Phase
  if (phase === 'results') {
    const chaosLost = lostRevenue.reduce((sum, l) => sum + l.amount, 0);
    const improvement = tradesuiteRevenue - chaosRevenue + chaosLost;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">📊 Final Results</h1>
          <p className="text-gray-600 text-center mb-8">Same 5 days, different systems</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-gray-500 text-sm mb-1">Without TradeSuite</p>
              <p className="text-2xl font-bold text-gray-900">${chaosRevenue.toLocaleString()}</p>
              <p className="text-red-600 text-sm">-${chaosLost.toLocaleString()} lost</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-500">
              <p className="text-gray-500 text-sm mb-1">With TradeSuite</p>
              <p className="text-2xl font-bold text-green-600">${tradesuiteRevenue.toLocaleString()}</p>
              <p className="text-green-600 text-sm">$0 lost</p>
            </div>
          </div>

          <div className="bg-green-100 rounded-xl p-6 mb-6 text-center">
            <p className="text-gray-600 mb-1">Additional Revenue with TradeSuite:</p>
            <p className="text-5xl font-bold text-green-600">+${improvement > 0 ? improvement.toLocaleString() : '0'}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="font-medium text-gray-900 mb-2">TradeSuite gives you:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Emergency calls highlighted at top</li>
              <li>✓ All client info in one place</li>
              <li>✓ One-click estimates and invoices</li>
              <li>✓ Automatic follow-up reminders</li>
              <li>✓ Revenue tracking dashboard</li>
            </ul>
          </div>

          <div className="text-center">
            <Link
              href="/signup?trade=electrician&source=game"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700"
            >
              Start Free Trial →
            </Link>
            <p className="text-gray-500 text-sm mt-3">$29/month • 14-day free trial</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}