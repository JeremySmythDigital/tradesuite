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
  createdAt: number; // timestamp for "hours ago"
}

type GamePhase = 'intro' | 'chaos' | 'transition' | 'tradesuite' | 'results';

const JOB_TYPES: Record<string, { label: string; basePrice: number }> = {
  service_call: { label: 'Service Call', basePrice: 189 },
  panel_upgrade: { label: 'Panel Upgrade', basePrice: 2400 },
  inspection: { label: 'Inspection', basePrice: 225 },
  remodel: { label: 'Remodel Wiring', basePrice: 7200 },
};

const CUSTOMERS = [
  { name: 'Johnson', phone: '555-0101', address: '123 Main St' },
  { name: 'Williams', phone: '555-0102', address: '456 Oak Ave' },
  { name: 'Garcia', phone: '555-0103', address: '789 Elm Blvd' },
  { name: 'Brown', phone: '555-0104', address: '321 Pine Lane' },
  { name: 'Martinez', phone: '555-0105', address: '654 Maple Dr' },
  { name: 'Miller', phone: '555-0106', address: '987 Cedar Ct' },
  { name: 'Davis', phone: '555-0107', address: '147 Birch Way' },
  { name: 'Wilson', phone: '555-0108', address: '258 Willow Rd' },
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

function generateJob(index: number): Job {
  const types = Object.keys(JOB_TYPES) as Job['type'][];
  const type = types[Math.floor(Math.random() * types.length)];
  const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
  const urgency: Job['urgency'] = Math.random() > 0.75 ? 'emergency' : Math.random() > 0.5 ? 'scheduled' : 'flexible';
  const multiplier = urgency === 'emergency' ? 1.5 : 1;
  
  return {
    id: `job-${index}`,
    type,
    customer: customer.name,
    phone: customer.phone,
    address: customer.address,
    value: Math.round(JOB_TYPES[type].basePrice * multiplier),
    urgency,
    description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
    createdAt: Math.floor(Math.random() * 72), // hours ago (0-72)
  };
}

function generateJobs(count: number): Job[] {
  return Array.from({ length: count }, (_, i) => generateJob(i));
}

function addId(prev: Set<string>, id: string): Set<string> {
  const next = new Set<string>(prev);
  next.add(id);
  return next;
}

export default function ElectricianGame() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [day, setDay] = useState(1);
  
  // Chaos mode state
  const [chaosJobs, setChaosJobs] = useState<Job[]>([]);
  const [chaosRevenue, setChaosRevenue] = useState(0);
  const [chaosLost, setChaosLost] = useState(0);
  const [chaosCompleted, setChaosCompleted] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [chaosActionsLeft, setChaosActionsLeft] = useState(3); // Limited actions per day!
  
  // TradeSuite mode state - same jobs for fair comparison
  const [tradesuiteJobs, setTradesuiteJobs] = useState<Job[]>([]);
  const [tradesuiteRevenue, setTradesuiteRevenue] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  
  const [message, setMessage] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Initialize
  useEffect(() => {
    if (phase === 'chaos' && chaosJobs.length === 0) {
      setChaosJobs(generateJobs(6));
      setChaosActionsLeft(3);
    }
    if (phase === 'tradesuite' && tradesuiteJobs.length === 0) {
      setTradesuiteJobs(generateJobs(6));
    }
  }, [phase]);

  // Chaos: Complete job (costs an action)
  const handleChaosComplete = (job: Job) => {
    if (chaosActionsLeft <= 0) {
      setMessage('No actions left! You must end the day.');
      return;
    }
    
    // In chaos mode, you might LOSE money due to inefficiency
    const efficiency = Math.random() > 0.3 ? 1 : 0.7; // 30% chance to lose 30%
    const earned = Math.round(job.value * efficiency);
    
    setChaosCompleted(prev => prev + 1);
    setChaosRevenue(prev => prev + earned);
    setChaosJobs(prev => prev.filter(j => j.id !== job.id));
    setSelectedJobId(null);
    setChaosActionsLeft(prev => prev - 1);
    
    if (efficiency < 1) {
      setMessage(`Completed, but lost ${Math.round((1-efficiency)*100)}% to inefficiency. $${earned} earned.`);
    } else {
      setMessage(`Completed ${job.customer}. $${earned} earned.`);
    }
  };

  // Chaos: Skip = lose customer
  const handleChaosSkip = (job: Job) => {
    const lost = Math.round(job.value * 0.5);
    setChaosLost(prev => prev + lost);
    setChaosJobs(prev => prev.filter(j => j.id !== job.id));
    setSelectedJobId(null);
    setMessage(`Lost ${job.customer}. They called someone else.`);
  };

  // Chaos: End day
  const handleChaosEndDay = () => {
    // Any remaining emergency jobs = total loss
    chaosJobs.forEach(job => {
      if (job.urgency === 'emergency') {
        setChaosLost(prev => prev + job.value);
        setMessage(prev => prev + ` Emergency ${job.customer} missed! Lost $${job.value}.`);
      }
    });
    setShowSummary(true);
  };

  // Chaos: Next day
  const handleChaosNextDay = () => {
    setShowSummary(false);
    if (day >= 3) {
      setPhase('transition');
      return;
    }
    setDay(prev => prev + 1);
    setChaosJobs(generateJobs(6));
    setChaosActionsLeft(3);
    setSelectedJobId(null);
  };

  // TradeSuite: Complete (no action limit, always efficient)
  const handleTradesuiteComplete = (job: Job) => {
    if (completedIds.has(job.id)) return;
    
    setCompletedIds(prev => addId(prev, job.id));
    setTradesuiteRevenue(prev => prev + job.value);
    setMessage(`✓ Completed ${job.customer} - $${job.value.toLocaleString()} (instant invoice sent)`);
  };

  // TradeSuite: End day
  const handleTradesuiteEndDay = () => {
    setShowSummary(true);
  };

  // TradeSuite: Next day
  const handleTradesuiteNextDay = () => {
    setShowSummary(false);
    if (day >= 3) {
      setPhase('results');
      return;
    }
    setDay(prev => prev + 1);
    setTradesuiteJobs(generateJobs(6));
    setCompletedIds(new Set());
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚡ The Electrician&apos;s Dilemma</h1>
          <p className="text-gray-600 mb-6">Spreadsheets vs TradeSuite - which earns you more?</p>
          
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-3">📋 The Rules:</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>3 days each mode</strong> - Same economy, different tools</li>
              <li><strong>Chaos Mode:</strong> Only 3 actions per day. Choose wisely.</li>
              <li><strong>Emergency jobs:</strong> If you don&apos;t complete them TODAY, customer leaves.</li>
              <li><strong>Inefficiency:</strong> Chaos has 30% chance to lose revenue on each job.</li>
              <li><strong>TradeSuite Mode:</strong> Unlimited actions, zero losses, everything organized.</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">❌ Chaos Mode</h4>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Only 3 actions per day</li>
                <li>• Emergency jobs buried in list</li>
                <li>• 30% chance to lose revenue</li>
                <li>• Skipping = customer lost</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">✓ TradeSuite</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Unlimited actions</li>
                <li>• Emergencies highlighted at TOP</li>
                <li>• 100% revenue captured</li>
                <li>• Skipping = schedule for later</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setPhase('chaos')}
            className="w-full px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold text-lg hover:bg-yellow-700"
          >
            Start Day 1 (Chaos Mode) →
          </button>
        </div>
      </div>
    );
  }

  // DAY SUMMARY
  if (showSummary) {
    const isChaos = phase === 'chaos';
    const remaining = isChaos 
      ? chaosJobs.filter(j => j.urgency === 'emergency' && !completedIds.has(j.id)).length 
      : 0;
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">
            {isChaos ? `Day ${day} Complete (Chaos)` : `Day ${day} Complete`}
          </h2>
          
          <div className="bg-green-50 rounded-xl p-6 mb-4">
            <p className="text-gray-600 mb-1">Revenue Today:</p>
            <p className="text-4xl font-bold text-green-600">
              ${(isChaos ? chaosRevenue : tradesuiteRevenue).toLocaleString()}
            </p>
          </div>

          {isChaos && chaosLost > 0 && (
            <div className="bg-red-50 rounded-xl p-4 mb-4">
              <p className="text-red-600 font-bold">Lost: ${chaosLost.toLocaleString()}</p>
              <p className="text-red-500 text-sm">Due to inefficiency & missed emergencies</p>
            </div>
          )}

          {!isChaos && (
            <div className="bg-green-100 rounded-lg p-3 mb-4">
              <p className="text-green-700">✓ All customers invoiced automatically</p>
              <p className="text-green-700">✓ Zero revenue lost</p>
            </div>
          )}

          {isChaos && remaining > 0 && (
            <div className="bg-red-100 rounded-lg p-3 mb-4 text-red-700">
              ⚠️ {remaining} emergency job{remaining > 1 ? 's' : ''} were missed - customers called competitors!
            </div>
          )}

          <button
            onClick={isChaos ? handleChaosNextDay : handleTradesuiteNextDay}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            {day >= 3 
              ? (isChaos ? 'Continue to TradeSuite →' : 'See Final Results →')
              : `Start Day ${day + 1} →`
            }
          </button>
        </div>
      </div>
    );
  }

  // CHAOS MODE
  if (phase === 'chaos') {
    const remaining = chaosJobs.length;
    const emergencies = chaosJobs.filter(j => j.urgency === 'emergency').length;
    
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="bg-gray-800 text-white p-4 sticky top-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">📱 Phone Notes - Day {day}/3</p>
              <h1 className="text-xl font-bold">Chaos Mode</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${chaosRevenue.toLocaleString()}</p>
              {chaosLost > 0 && <p className="text-red-400 text-sm">-${chaosLost.toLocaleString()} lost</p>}
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-blue-900 p-3 text-center text-blue-200 text-sm">
            {message}
          </div>
        )}

        <div className="max-w-4xl mx-auto p-4">
          {/* ACTION LIMIT - This is the key difference! */}
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 font-bold">⚠️ Actions Remaining: {chaosActionsLeft}</p>
                <p className="text-red-300 text-sm">You can only take 3 actions per day in chaos mode.</p>
              </div>
              <div className="text-right">
                <p className="text-red-200 text-sm">Jobs: {remaining}</p>
                {emergencies > 0 && (
                  <p className="text-red-400 font-bold">⚡ {emergencies} emergency</p>
                )}
              </div>
            </div>
          </div>

          {/* Job List - UNORGANIZED, have to click to see details */}
          <div className="space-y-2">
            <p className="text-gray-400 text-sm mb-2">Click a job to see details:</p>
            
            {chaosJobs.map((job) => (
              <div key={job.id}>
                <div 
                  onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                  className={`bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                    job.urgency === 'emergency' ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{job.customer}</span>
                      <span className="text-gray-500 text-sm ml-2">({job.createdAt}h ago)</span>
                    </div>
                    <span className="text-green-400 font-bold">${job.value.toLocaleString()}</span>
                  </div>
                  {selectedJobId === job.id && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-gray-300 text-sm">{DESCRIPTIONS[0]}</p>
                      <p className="text-gray-500 text-sm">📞 {job.phone} • 📍 {job.address}</p>
                      {job.urgency === 'emergency' && (
                        <p className="text-red-400 text-sm mt-1">⚡ EMERGENCY - Must complete today!</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleChaosComplete(job); }}
                          disabled={chaosActionsLeft <= 0}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                        >
                          Complete (-1 action)
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleChaosSkip(job); }}
                          className="px-3 py-2 bg-gray-600 text-white rounded text-sm"
                        >
                          Skip (lose customer)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleChaosEndDay}
            className="w-full mt-6 px-6 py-4 bg-yellow-600 text-white rounded-lg font-bold text-lg hover:bg-yellow-700"
          >
            End Day {day} (Lose incomplete emergencies)
          </button>
        </div>
      </div>
    );
  }

  // TRANSITION
  if (phase === 'transition') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-6">📊 Chaos Mode Results</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-gray-600 text-sm">Earned:</p>
              <p className="text-3xl font-bold text-green-600">${chaosRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-gray-600 text-sm">Lost:</p>
              <p className="text-3xl font-bold text-red-600">${chaosLost.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
            <p className="font-bold mb-2">Why you lost money:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Only 3 actions per day limit</li>
              <li>• Had to click each job to see if it was urgent</li>
              <li>• Emergency jobs got buried in the list</li>
              <li>• 30% chance to lose revenue on each job</li>
              <li>• Skipping = customer called someone else</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-4">Now try with TradeSuite...</p>
          
          <button
            onClick={() => { setDay(1); setPhase('tradesuite'); }}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700"
          >
            Try TradeSuite →
          </button>
        </div>
      </div>
    );
  }

  // TRADESUITE MODE
  if (phase === 'tradesuite') {
    // Sort: emergencies FIRST
    const sortedJobs = [...tradesuiteJobs].sort((a, b) => {
      if (a.urgency === 'emergency' && b.urgency !== 'emergency') return -1;
      if (a.urgency !== 'emergency' && b.urgency === 'emergency') return 1;
      return a.createdAt - b.createdAt;
    });
    const completedCount = completedIds.size;
    const emergencyCount = sortedJobs.filter(j => j.urgency === 'emergency' && !completedIds.has(j.id)).length;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-xl">TradeSuite</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${tradesuiteRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Day {day}/3
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="max-w-4xl mx-auto px-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800">
              {message}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-xl font-bold">{sortedJobs.length - completedCount}</p>
            </div>
            <div className={`rounded-lg p-3 shadow-sm ${emergencyCount > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <p className="text-xs text-gray-500">Urgent</p>
              <p className={`text-xl font-bold ${emergencyCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {emergencyCount} {emergencyCount > 0 ? '⚡' : '✓'}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500">Lost</p>
              <p className="text-xl font-bold text-green-600">$0</p>
            </div>
          </div>

          {/* Key difference: NO ACTION LIMIT */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-800 font-medium">✓ Unlimited actions - complete all jobs!</p>
            <p className="text-green-700 text-sm">Every job visible at a glance, emergencies flagged automatically.</p>
          </div>

          {/* Job Board - ORGANIZED, all info visible */}
          <div className="bg-white rounded-xl shadow-sm">
            {sortedJobs.length === completedCount ? (
              <div className="p-8 text-center">
                <p className="text-green-600 text-xl mb-2">✓ Day Complete!</p>
                <button
                  onClick={handleTradesuiteEndDay}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  End Day {day} →
                </button>
              </div>
            ) : (
              sortedJobs.map((job) => {
                const isDone = completedIds.has(job.id);
                return (
                  <div 
                    key={job.id} 
                    className={`p-4 border-b last:border-b-0 ${
                      job.urgency === 'emergency' && !isDone ? 'bg-red-50' : ''
                    } ${isDone ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {job.urgency === 'emergency' && !isDone && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-medium animate-pulse">
                              ⚡ URGENT
                            </span>
                          )}
                          <span className="font-medium">{JOB_TYPES[job.type].label}</span>
                          {isDone && <span className="text-green-600">✓</span>}
                        </div>
                        <p className="font-medium text-gray-900">{job.customer}</p>
                        <p className="text-gray-500 text-sm">📞 {job.phone} • 📍 {job.address}</p>
                        <p className="text-gray-400 text-sm">{job.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">${job.value.toLocaleString()}</p>
                        {!isDone && (
                          <button
                            onClick={() => handleTradesuiteComplete(job)}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            Complete & Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={handleTradesuiteEndDay}
            className="w-full mt-4 px-6 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700"
          >
            End Day {day} →
          </button>
        </div>
      </div>
    );
  }

  // RESULTS
  if (phase === 'results') {
    const improvement = tradesuiteRevenue - chaosRevenue + chaosLost;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-6">📊 Side-by-Side Comparison</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 rounded-xl p-6">
              <p className="text-gray-600 text-sm mb-1">Chaos Mode (3 days)</p>
              <p className="text-3xl font-bold text-gray-900">${chaosRevenue.toLocaleString()}</p>
              <p className="text-red-600 text-sm mt-2">-${chaosLost.toLocaleString()} lost to inefficiency</p>
              <p className="text-gray-500 text-xs mt-1">3 actions per day limit</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-500">
              <p className="text-gray-600 text-sm mb-1">TradeSuite (3 days)</p>
              <p className="text-3xl font-bold text-green-600">${tradesuiteRevenue.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-2">$0 lost</p>
              <p className="text-green-500 text-xs mt-1">Unlimited actions</p>
            </div>
          </div>

          <div className="bg-green-100 rounded-xl p-6 mb-6 text-center">
            <p className="text-gray-600 mb-1">TradeSuite would have earned you:</p>
            <p className="text-5xl font-bold text-green-600">
              +${improvement > 0 ? improvement.toLocaleString() : '0'}
            </p>
            <p className="text-gray-500 text-sm mt-1">more revenue this week</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-bold mb-2">What you get with TradeSuite:</p>
            <ul className="text-sm text-gray-700 grid grid-cols-2 gap-1">
              <li>✓ Unlimited actions per day</li>
              <li>✓ Emergency calls at the top</li>
              <li>✓ All customer info visible</li>
              <li>✓ One-click invoices</li>
              <li>✓ Zero revenue lost</li>
              <li>✓ Automatic scheduling</li>
            </ul>
          </div>

          <Link
            href="/signup?trade=electrician"
            className="block w-full px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg text-center hover:bg-blue-700"
          >
            Start Free Trial →
          </Link>
          <p className="text-gray-500 text-sm text-center mt-3">$29/month • 14-day free trial</p>
        </div>
      </div>
    );
  }

  return null;
}