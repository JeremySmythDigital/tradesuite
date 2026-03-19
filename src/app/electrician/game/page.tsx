'use client';
import { useState, useEffect } from 'react';

interface Job {
  id: string;
  type: 'service_call' | 'panel_upgrade' | 'inspection' | 'remodel';
  customer: string;
  address: string;
  estimatedValue: number;
  status: 'pending' | 'in_progress' | 'completed';
  urgency: 'emergency' | 'scheduled' | 'flexible';
}

interface GameState {
  day: number;
  money: number;
  reputation: number;
  jobs: Job[];
  activeJob: Job | null;
  message: string;
}

const JOB_TITLES: Record<string, string> = {
  service_call: '🔧 Service Call',
  panel_upgrade: '⚡ Panel Upgrade',
  inspection: '📋 Inspection',
  remodel: '🏠 Remodel Job',
};

const JOB_VALUES: Record<string, number> = {
  service_call: 150,
  panel_upgrade: 2500,
  inspection: 200,
  remodel: 8500,
};

const JOB_DURATIONS: Record<string, number> = {
  service_call: 1,
  panel_upgrade: 3,
  inspection: 1,
  remodel: 5,
};

const CUSTOMERS = [
  'Johnson Residence', 'Smith Family Home', 'Riverside Apartments',
  'Downtown Office Building', 'Miller Property', 'Green Valley Homes',
  'Oak Park Residences', 'Central Business Complex',
];

const STREETS = [
  '123 Main St', '456 Oak Ave', '789 Elm Blvd', '321 Pine Lane',
  '654 Maple Drive', '987 Cedar Court', '246 Birch Way', '135 Willow Road',
];

function generateJob(): Job {
  const types: Job['type'][] = ['service_call', 'panel_upgrade', 'inspection', 'remodel'];
  const type = types[Math.floor(Math.random() * types.length)];
  const urgencies: Job['urgency'][] = ['emergency', 'scheduled', 'flexible'];
  const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
  
  return {
    id: Math.random().toString(36).substring(7),
    type,
    customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
    address: STREETS[Math.floor(Math.random() * STREETS.length)],
    estimatedValue: JOB_VALUES[type] + Math.floor(Math.random() * 500),
    status: 'pending',
    urgency,
  };
}

export default function ElectricianGame() {
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    money: 0,
    reputation: 100,
    jobs: [],
    activeJob: null,
    message: 'Welcome! Take jobs to earn money and build reputation.',
  });

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && gameState.jobs.length === 0) {
      const initialJobs: Job[] = [];
      for (let i = 0; i < 5; i++) {
        initialJobs.push(generateJob());
      }
      setGameState(prev => ({ ...prev, jobs: initialJobs }));
    }
  }, [gameStarted]);

  const acceptJob = (job: Job) => {
    if (gameState.activeJob) {
      setGameState(prev => ({
        ...prev,
        message: 'You already have an active job! Complete it first.',
      }));
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      activeJob: { ...job, status: 'in_progress' },
      jobs: prev.jobs.filter(j => j.id !== job.id),
      message: `Job accepted! Wait for completion...`,
    }));
    
    setTimeout(() => {
      const bonus = job.urgency === 'emergency' ? 50 : 0;
      setGameState(prev => ({
        ...prev,
        money: prev.money + job.estimatedValue + bonus,
        reputation: Math.min(100, prev.reputation + (job.urgency === 'emergency' ? 5 : 2)),
        activeJob: null,
        message: `✅ Completed ${JOB_TITLES[job.type]} for $${(job.estimatedValue + bonus).toLocaleString()}!`,
      }));
    }, 2000);
  };

  const skipJob = (jobId: string) => {
    setGameState(prev => ({
      ...prev,
      jobs: prev.jobs.filter(j => j.id !== jobId),
      reputation: Math.max(0, prev.reputation - 5),
      message: '⚠️ Skipped job. Reputation -5.',
    }));
  };

  const nextDay = () => {
    setGameState(prev => ({
      ...prev,
      day: prev.day + 1,
      jobs: [...prev.jobs, generateJob(), generateJob()].slice(0, 8),
    }));
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">⚡ Electrician Business Simulator</h1>
          <p className="text-gray-600 mb-6">
            Run your electrical business for 30 days. Take jobs, manage customers, and grow revenue.
            <br /><br />
            <strong>Learn how TradeSuite helps electricians succeed.</strong>
          </p>
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-semibold text-yellow-800 mb-2">How to Play:</p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Accept jobs from your job board</li>
              <li>• Emergency jobs pay bonus but need quick action</li>
              <li>• Build reputation by completing jobs</li>
              <li>• See how TradeSuite makes managing easier</li>
            </ul>
          </div>
          <button
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-yellow-700 transition-colors w-full"
          >
            Start Your Business →
          </button>
          <p className="text-gray-400 text-sm mt-4">Takes 2-5 minutes to complete</p>
        </div>
      </div>
    );
  }

  if (gameState.day > 30) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Month Complete!</h1>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <p className="text-5xl font-bold text-green-600">${gameState.money.toLocaleString()}</p>
            <p className="text-green-700">Total Revenue</p>
          </div>
          <p className="text-gray-600 mb-6">
            In real life, you would need spreadsheets, invoices, calendars, and more.
            <br /><strong>TradeSuite handles it all in one place.</strong>
          </p>
          <a
            href="/signup?trade=electrician"
            className="block px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-yellow-700 transition-colors"
          >
            Try TradeSuite Free →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">⚡ Electrician Simulator</h1>
            <p className="text-yellow-100 text-sm">Day {gameState.day} of 30</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">${gameState.money.toLocaleString()}</p>
              <p className="text-xs text-yellow-100">Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{gameState.reputation}</p>
              <p className="text-xs text-yellow-100">Reputation</p>
            </div>
          </div>
        </div>
      </div>

      {gameState.message && (
        <div className="bg-blue-50 border-b border-blue-100 p-3 text-center text-blue-800 text-sm">
          {gameState.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-4">
        {gameState.activeJob && (
          <div className="md:col-span-3 bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-yellow-800">⏳ Active Job</h3>
                <p className="text-yellow-700">
                  {JOB_TITLES[gameState.activeJob.type]} - {gameState.activeJob.customer}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-800">${gameState.activeJob.estimatedValue.toLocaleString()}</p>
                <div className="animate-pulse text-sm text-yellow-600">Processing...</div>
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold mb-4">📋 Job Board ({gameState.jobs.length} available)</h2>
            
            {gameState.jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No jobs available. Click &quot;Next Day&quot; for new jobs.</p>
            ) : (
              <div className="space-y-3">
                {gameState.jobs.map(job => (
                  <div key={job.id} className={`border rounded-lg p-3 ${job.urgency === 'emergency' ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{JOB_TITLES[job.type]}</span>
                          {job.urgency === 'emergency' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">🔥 Emergency +$50</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{job.customer}</p>
                        <p className="text-xs text-gray-500">{job.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${job.estimatedValue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => acceptJob(job)}
                        disabled={!!gameState.activeJob}
                        className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Accept Job
                      </button>
                      <button
                        onClick={() => skipJob(job.id)}
                        className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Skip (-5 rep)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold mb-3">📊 Stats</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Reputation</span>
                  <span>{gameState.reputation}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${gameState.reputation}%` }} />
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-2xl font-bold text-green-600">${gameState.money.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>
          </div>

          <button onClick={nextDay} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
            Next Day →
          </button>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>TradeSuite Tip:</strong> In real life, manage all these jobs with automatic scheduling, client tracking, and one-click invoicing.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-gray-600 text-sm">🎮 Day {gameState.day}/30</p>
          <a href="/signup?trade=electrician" className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700">
            Try Real TradeSuite →
          </a>
        </div>
      </div>
    </div>
  );
}