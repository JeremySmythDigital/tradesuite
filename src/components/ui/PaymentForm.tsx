'use client';

import { useState, useEffect } from 'react';
import { Lock, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  invoiceId?: string;
  description?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentForm({ amount, invoiceId, description, onSuccess, onCancel }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Card form state (for demo - in production, use Stripe Elements)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage(null);

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setErrorMessage('Please enter a valid card number');
      setPaymentStatus('error');
      setIsProcessing(false);
      return;
    }
    if (expiry.length < 5) {
      setErrorMessage('Please enter a valid expiry date');
      setPaymentStatus('error');
      setIsProcessing(false);
      return;
    }
    if (cvc.length < 3) {
      setErrorMessage('Please enter a valid CVC');
      setPaymentStatus('error');
      setIsProcessing(false);
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter the cardholder name');
      setPaymentStatus('error');
      setIsProcessing(false);
      return;
    }

    try {
      // In production, this would:
      // 1. Create PaymentIntent with Stripe
      // 2. Use Stripe.js to collect card details securely
      // 3. Confirm the payment
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success (in production, check Stripe response)
      setPaymentStatus('success');
      setIsProcessing(false);
      
      // Call success callback
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('Payment failed. Please try again.');
      setPaymentStatus('error');
      setIsProcessing(false);
    }
  };

  // Success state
  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">
          ${amount.toFixed(2)} has been charged{description && ` for ${description}`}.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          A confirmation has been sent to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-80">Amount Due</span>
          <Lock className="w-4 h-4 opacity-80" />
        </div>
        <div className="text-3xl font-bold">${amount.toFixed(2)}</div>
        {description && (
          <p className="text-blue-100 text-sm mt-1">{description}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        )}

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
            isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>

        {/* Cancel Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Card Logos */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <span className="text-xs">Accepted:</span>
          <span className="font-bold">Visa</span>
          <span className="font-bold">Mastercard</span>
          <span className="font-bold">Amex</span>
          <span className="font-bold">Discover</span>
        </div>
      </div>
    </div>
  );
}