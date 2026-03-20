'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface ReviewRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  jobId: string;
  jobTitle: string;
  completedDate: string;
  status: 'pending' | 'sent' | 'completed' | 'responded';
  rating?: number;
  review?: string;
  respondedAt?: string;
}

interface ReviewAutomationProps {
  requests: ReviewRequest[];
  onSendRequest: (requestId: string) => Promise<void>;
  onViewReview: (requestId: string) => void;
}

export function ReviewAutomation({ requests, onSendRequest, onViewReview }: ReviewAutomationProps) {
  const [sending, setSending] = useState<string | null>(null);

  const handleSend = async (requestId: string) => {
    setSending(requestId);
    try {
      await onSendRequest(requestId);
    } finally {
      setSending(null);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const sentRequests = requests.filter(r => r.status === 'sent');
  const completedReviews = requests.filter(r => r.status === 'completed' || r.status === 'responded');

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    responded: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">Review Requests</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              Pending: {pendingRequests.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Sent: {sentRequests.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Reviews: {completedReviews.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="p-3 bg-yellow-50 border-b border-yellow-100">
            <h3 className="font-medium text-yellow-800">Ready to Send ({pendingRequests.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{request.customerName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{request.jobTitle}</p>
                  <p className="text-xs text-gray-500">Completed: {new Date(request.completedDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleSend(request.id)}
                  disabled={sending === request.id}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {sending === request.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send Request</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="p-3 bg-blue-50 border-b border-blue-100">
            <h3 className="font-medium text-blue-800">Awaiting Response ({sentRequests.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {sentRequests.map((request) => (
              <div key={request.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{request.customerName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{request.jobTitle}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Sent {new Date(request.completedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => onViewReview(request.id)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Resend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Reviews */}
      {completedReviews.length > 0 && (
        <div>
          <div className="p-3 bg-green-50 border-b border-green-100">
            <h3 className="font-medium text-green-800">Reviews Received ({completedReviews.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {completedReviews.map((request) => (
              <div key={request.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{request.customerName}</span>
                    {request.rating && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= request.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{request.jobTitle}</p>
                  {request.review && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">"{request.review}"</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {request.status === 'responded' ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Responded
                    </span>
                  ) : (
                    <button
                      onClick={() => onViewReview(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Respond
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No review requests yet</p>
          <p className="text-sm">Complete jobs to start collecting reviews</p>
        </div>
      )}
    </div>
  );
}

// Review Request Email Template Component
export function ReviewRequestEmailTemplate({ 
  customerName, 
  jobTitle, 
  reviewLink 
}: { 
  customerName: string; 
  jobTitle: string; 
  reviewLink: string;
}) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#2563eb', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: 0 }}>How did we do?</h1>
      </div>
      <div style={{ padding: '24px', backgroundColor: '#f9fafb' }}>
        <p style={{ fontSize: '16px', color: '#374151' }}>
          Hi {customerName},
        </p>
        <p style={{ fontSize: '16px', color: '#374151', marginTop: '16px' }}>
          Thank you for choosing us for your <strong>{jobTitle}</strong>. We hope everything met your expectations!
        </p>
        <p style={{ fontSize: '16px', color: '#374151', marginTop: '16px' }}>
          Would you take 30 seconds to share your experience? Your feedback helps other homeowners find reliable professionals.
        </p>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a 
            href={reviewLink}
            style={{ 
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Leave a Review
          </a>
        </div>
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            ⭐ ⭐ ⭐ ⭐ ⭐
          </p>
        </div>
      </div>
      <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
        <p>You received this email because you completed a job with us.</p>
        <p style={{ marginTop: '8px' }}>
          If you have any concerns, please contact us directly before leaving a review.
        </p>
      </div>
    </div>
  );
}