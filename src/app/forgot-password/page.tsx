import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - TradeSuite',
  description: 'Reset your TradeSuite password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <Briefcase className="w-12 h-12 text-white mx-auto mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Reset Your Password</h1>
          <p className="text-blue-100 mt-2">We will send you a reset link.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ForgotPasswordForm />
          
          <p className="text-center text-gray-600 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}