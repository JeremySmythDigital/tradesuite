'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [ghlApiKey, setGhlApiKey] = useState('');
  const [ghlLocationId, setGhlLocationId] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/ghl/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: ghlApiKey, locationId: ghlLocationId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestResult('✅ Connection successful! GHL API is working.');
      } else {
        setTestResult(`❌ Connection failed: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">GoHighLevel Integration</h2>
        <p className="text-gray-600 mb-4">
          Connect your GoHighLevel account to sync contacts, estimates, and invoices.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GHL API Key
            </label>
            <input
              type="password"
              value={ghlApiKey}
              onChange={(e) => setGhlApiKey(e.target.value)}
              placeholder="Enter your GHL API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location ID
            </label>
            <input
              type="text"
              value={ghlLocationId}
              onChange={(e) => setGhlLocationId(e.target.value)}
              placeholder="Enter your GHL Location ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <button
            onClick={handleTestConnection}
            disabled={isLoading || !ghlApiKey || !ghlLocationId}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-3 rounded-md ${testResult.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {testResult}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Documentation</h2>
        <p className="text-gray-600 mb-4">
          To get your GHL API credentials:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Log into your GoHighLevel account</li>
          <li>Go to Settings → API</li>
          <li>Generate a Private Integration API Key</li>
          <li>Copy the API Key and Location ID</li>
          <li>Paste them above and click "Test Connection"</li>
        </ol>
      </div>
    </div>
  );
}