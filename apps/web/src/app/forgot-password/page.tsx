'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { forgotPassword } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-sm mx-auto mt-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full p-5">
            <Mail size={36} className="text-violet-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-purple-900 mb-2">Check your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          If an account with <span className="font-medium text-gray-700">{email}</span> exists,
          we&apos;ve sent a password reset link. Check your inbox (and spam folder).
        </p>
        <Link href="/login"
          className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-purple-900">Forgot Password?</h1>
        <p className="text-gray-400 text-sm mt-1">Enter your email and we&apos;ll send a reset link.</p>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm shadow-purple-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          <Link href="/login" className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium">
            <ArrowLeft size={13} /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
