'use client';

import { useState } from 'react';
import { CreditCard, Bell, Link as LinkIcon, Settings as SettingsIcon, Building, Shield, Check, X, RefreshCw } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'pending';
  logo?: string;
}

const integrations: Integration[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    description: 'Sync invoices, customers, and payments with QuickBooks',
    icon: Building,
    status: 'disconnected',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept credit card and ACH payments',
    icon: CreditCard,
    status: 'connected',
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Send SMS notifications to customers',
    icon: Bell,
    status: 'connected',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and newsletters',
    icon: LinkIcon,
    status: 'disconnected',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'notifications' | 'security'>('general');
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (integrationId: string) => {
    setConnecting(integrationId);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnecting(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          Settings
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {[
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'integrations', label: 'Integrations', icon: LinkIcon },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Company Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Acme Plumbing" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="contact@acmeplumbing.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://acmeplumbing.com" />
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Business Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Sacramento" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="CA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="95814" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${integration.status === 'connected' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <integration.icon className={`w-6 h-6 ${integration.status === 'connected' ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    integration.status === 'connected' 
                      ? 'bg-green-100 text-green-700' 
                      : integration.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {integration.status}
                  </span>
                  <button
                    onClick={() => handleConnect(integration.id)}
                    disabled={connecting === integration.id}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      integration.status === 'connected'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50`}
                  >
                    {connecting === integration.id ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Connecting...
                      </span>
                    ) : integration.status === 'connected' ? (
                      'Manage'
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">SMS Notifications</h2>
              <div className="space-y-4">
                {[
                  { id: 'job_reminder', label: 'Job Reminder (24h before)', enabled: true },
                  { id: 'job_confirmation', label: 'Job Confirmation', enabled: true },
                  { id: 'job_complete', label: 'Job Complete + Review Request', enabled: true },
                  { id: 'estimate_ready', label: 'Estimate Ready', enabled: false },
                  { id: 'invoice_sent', label: 'Invoice Sent', enabled: false },
                ].map((notif) => (
                  <label key={notif.id} className="flex items-center justify-between py-2 cursor-pointer">
                    <span className="text-gray-700">{notif.label}</span>
                    <input type="checkbox" defaultChecked={notif.enabled} className="w-5 h-5 text-blue-600 rounded" />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Email Notifications</h2>
              <div className="space-y-4">
                {[
                  { id: 'daily_summary', label: 'Daily Summary', enabled: true },
                  { id: 'new_lead', label: 'New Lead Alert', enabled: true },
                  { id: 'payment_received', label: 'Payment Received', enabled: true },
                  { id: 'weekly_report', label: 'Weekly Report', enabled: false },
                ].map((notif) => (
                  <label key={notif.id} className="flex items-center justify-between py-2 cursor-pointer">
                    <span className="text-gray-700">{notif.label}</span>
                    <input type="checkbox" defaultChecked={notif.enabled} className="w-5 h-5 text-blue-600 rounded" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Two-Factor Authentication</h2>
              <p className="text-gray-600 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}