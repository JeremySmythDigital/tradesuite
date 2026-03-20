'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Share2 } from 'lucide-react';

interface ReferralData {
  code: string;
  referrals: number;
  credits: number;
}

export function ReferralTracker({ email }: { email: string }) {
  const [referral, setReferral] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (email) {
      fetch(`/api/referral?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReferral(data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [email]);
  
  const referralUrl = referral ? `https://cypress-signal.vercel.app/signup?ref=${referral.code}` : '';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Cypress Signal - Trade-specific CRM',
        text: 'Check out Cypress Signal - the CRM built for trades. Use my referral link for a discount!',
        url: referralUrl,
      });
    } else {
      copyToClipboard();
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-blue-600" />
        <h3 className="font-bold text-lg">Refer & Earn</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Share your referral link and earn <span className="font-bold text-green-600">$10 credit</span> for each friend who signs up!
      </p>
      
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">Your Referral Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-gray-200 truncate">
            {referralUrl}
          </code>
          <button
            onClick={copyToClipboard}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button
          onClick={shareLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{referral?.referrals || 0}</p>
          <p className="text-xs text-gray-500">Referrals</p>
        </div>
      </div>
      
      {(referral?.credits || 0) > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <span className="font-bold">${referral?.credits || 0}</span> in credits earned
          </p>
        </div>
      )}
    </div>
  );
}