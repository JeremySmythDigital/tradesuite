'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PRICING = {
  solo: { name: 'Solo', price: 29, features: ['Unlimited clients', 'Estimates & invoices', 'Scheduling calendar', 'Industry templates', '1 user'] },
  team: { name: 'Team', price: 79, features: ['Everything in Solo', 'Up to 5 users', 'Team scheduling', 'Client portal', 'Priority support'] },
  business: { name: 'Business', price: 149, features: ['Everything in Team', 'Unlimited users', 'API access', 'Custom branding', 'Dedicated support'] },
};

export function Signup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planFromUrl = searchParams.get('plan') || 'solo';
  
  const [selectedPlan, setSelectedPlan] = useState<'solo' | 'team' | 'business'>(planFromUrl as 'solo' | 'team' | 'business');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [step, setStep] = useState<'account' | 'payment'>('account');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && ['solo', 'team', 'business'].includes(plan)) {
      setSelectedPlan(plan as 'solo' | 'team' | 'business');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const regResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
      });

      const regResult = await regResponse.json();

      if (regResult.success) {
        setStep('payment');
      } else {
        if (regResult.error?.includes('already exists')) {
          setStep('payment');
        } else {
          setError(regResult.error || 'Failed to create account');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          email: formData.email,
          userId: formData.email,
        }),
      });

      const result = await response.json();

      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || 'Failed to start checkout');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-bold text-2xl">TradeSuite</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {step === 'account' ? 'Create your account' : 'Choose your plan'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 'account' ? (
            <form className="space-y-6" onSubmit={handleAccountSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First name</label>
                  <input type="text" name="first_name" id="first_name" required value={formData.first_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last name</label>
                  <input type="text" name="last_name" id="last_name" required value={formData.last_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
              </div>
              {error && (<div className="rounded-md bg-red-50 p-4"><p className="text-sm text-red-700">{error}</p></div>)}
              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Creating account...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {(Object.keys(PRICING) as Array<keyof typeof PRICING>).map((planKey) => (
                  <div key={planKey} onClick={() => setSelectedPlan(planKey)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === planKey ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">{PRICING[planKey].name}</h3>
                      <span className="text-2xl font-bold">${PRICING[planKey].price}<span className="text-sm font-normal text-gray-500">/mo</span></span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {PRICING[planKey].features.slice(0, 3).map((feature) => (<li key={feature}>✓ {feature}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
              {error && (<div className="rounded-md bg-red-50 p-4"><p className="text-sm text-red-700">{error}</p></div>)}
              <button onClick={handlePayment} disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : `Subscribe for $${PRICING[selectedPlan].price}/month`}
              </button>
              <p className="text-center text-xs text-gray-500">You will be redirected to Stripe to complete your payment securely.</p>
            </div>
          )}
          <p className="mt-4 text-center text-xs text-gray-500">
            By creating an account, you agree to our <Link href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}