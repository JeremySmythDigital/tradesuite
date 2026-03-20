import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - Cypress Signal',
  description: 'Choose a new password for your Cypress Signal account.',
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <Briefcase className="w-12 h-12 text-white mx-auto mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Choose New Password</h1>
          <p className="text-blue-100 mt-2">Create a strong password for your account.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}