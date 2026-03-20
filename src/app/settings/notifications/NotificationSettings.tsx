'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Check, X, Save, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NotificationPreference {
  id: string;
  type: 'email' | 'sms' | 'push';
  category: string;
  name: string;
  description: string;
  enabled: boolean;
}

const defaultPreferences: NotificationPreference[] = [
  // Email notifications
  { id: '1', type: 'email', category: 'billing', name: 'Invoice Emails', description: 'Receive emails when invoices are sent or paid', enabled: true },
  { id: '2', type: 'email', category: 'billing', name: 'Estimate Emails', description: 'Receive emails when estimates are created or approved', enabled: true },
  { id: '3', type: 'email', category: 'billing', name: 'Payment Receipts', description: 'Get email confirmations for all payments', enabled: true },
  { id: '4', type: 'email', category: 'jobs', name: 'Job Updates', description: 'Email notifications when job status changes', enabled: true },
  { id: '5', type: 'email', category: 'jobs', name: 'Appointment Reminders', description: '24-hour email reminders for appointments', enabled: true },
  { id: '6', type: 'email', category: 'account', name: 'Account Activity', description: 'Login alerts and security notifications', enabled: true },
  { id: '7', type: 'email', category: 'marketing', name: 'Product Updates', description: 'New features and improvements', enabled: false },
  { id: '8', type: 'email', category: 'marketing', name: 'Newsletter', description: 'Tips, tricks, and industry insights', enabled: false },
  
  // SMS notifications
  { id: '9', type: 'sms', category: 'jobs', name: 'Job Status', description: 'Text when technician is en route', enabled: true },
  { id: '10', type: 'sms', category: 'jobs', name: 'Appointment Reminders', description: 'Day-of appointment reminders via text', enabled: true },
  { id: '11', type: 'sms', category: 'billing', name: 'Payment Alerts', description: 'Text confirmation when payment is received', enabled: false },
  
  // Push notifications
  { id: '12', type: 'push', category: 'jobs', name: 'Real-time Updates', description: 'Instant push when job status changes', enabled: true },
  { id: '13', type: 'push', category: 'chat', name: 'Chat Messages', description: 'Push notifications for live chat', enabled: true },
  { id: '14', type: 'push', category: 'account', name: 'Security Alerts', description: 'Immediate alerts for account security', enabled: true },
];

const categoryNames: Record<string, string> = {
  billing: 'Billing & Payments',
  jobs: 'Jobs & Appointments',
  account: 'Account & Security',
  marketing: 'Marketing',
  chat: 'Live Chat',
};

const typeIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
};

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    // Load preferences from API
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/settings/notifications');
        if (response.ok) {
          const data = await response.json();
          if (data.preferences) {
            setPreferences(data.preferences);
          }
          if (data.phoneNumber) {
            setPhoneNumber(data.phoneNumber);
          }
          if (data.pushEnabled !== undefined) {
            setPushEnabled(data.pushEnabled);
          }
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    
    loadPreferences();
  }, []);

  const togglePreference = (id: string) => {
    setPreferences(prev => 
      prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences,
          phoneNumber,
          pushEnabled,
        }),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  // Group preferences by type
  const emailPrefs = preferences.filter(p => p.type === 'email');
  const smsPrefs = preferences.filter(p => p.type === 'sms');
  const pushPrefs = preferences.filter(p => p.type === 'push');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-gray-500 hover:text-gray-700">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notification Settings</h1>
              <p className="text-sm text-gray-500">Manage how you receive updates</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Email Notifications */}
        <NotificationSection
          title="Email Notifications"
          icon={Mail}
          preferences={emailPrefs}
          onToggle={togglePreference}
          categoryNames={categoryNames}
        />

        {/* SMS Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-1">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">SMS Notifications</h2>
            </div>
            <p className="text-sm text-gray-500">Text message alerts (standard rates apply)</p>
          </div>
          
          {/* Phone number input */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Verify
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Standard SMS rates apply. Your number will never be shared.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {smsPrefs.map((pref) => (
              <NotificationToggle
                key={pref.id}
                preference={pref}
                onToggle={() => togglePreference(pref.id)}
                categoryName={categoryNames[pref.category]}
              />
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-1">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
            </div>
            <p className="text-sm text-gray-500">Browser and mobile push notifications</p>
          </div>
          
          {/* Enable push toggle */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Enable Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
              </div>
              <button
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  pushEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    pushEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pushPrefs.map((pref) => (
              <NotificationToggle
                key={pref.id}
                preference={pref}
                onToggle={() => togglePreference(pref.id)}
                categoryName={categoryNames[pref.category]}
                disabled={!pushEnabled}
              />
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Quiet Hours
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            We won't send notifications during these hours (your timezone)
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                defaultValue="07:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Emergency alerts (security, urgent job issues) will still be sent.
          </p>
        </div>
      </main>
    </div>
  );
}

function NotificationSection({
  title,
  icon: Icon,
  preferences,
  onToggle,
  categoryNames,
}: {
  title: string;
  icon: typeof Mail;
  preferences: NotificationPreference[];
  onToggle: (id: string) => void;
  categoryNames: Record<string, string>;
}) {
  const grouped = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) acc[pref.category] = [];
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, NotificationPreference[]>);

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      
      {Object.entries(grouped).map(([category, prefs]) => (
        <div key={category}>
          <div className="px-6 py-2 bg-gray-50 text-sm font-medium text-gray-500">
            {categoryNames[category]}
          </div>
          <div className="divide-y divide-gray-200">
            {prefs.map((pref) => (
              <NotificationToggle
                key={pref.id}
                preference={pref}
                onToggle={onToggle}
                categoryName={categoryNames[pref.category]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationToggle({
  preference,
  onToggle,
  categoryName,
  disabled = false,
}: {
  preference: NotificationPreference;
  onToggle: () => void;
  categoryName: string;
  disabled?: boolean;
}) {
  return (
    <div className={`p-4 flex items-center justify-between ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{preference.name}</p>
        <p className="text-sm text-gray-500">{preference.description}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          preference.enabled && !disabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-label={`Toggle ${preference.name}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            preference.enabled && !disabled ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}