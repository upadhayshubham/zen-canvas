'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      localStorage.setItem('zc_token', res.token);
      router.push('/orders');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Welcome Back</h1>
        <p className="text-stone-400 text-sm mt-1">Sign in to your Zen Canvas account</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-purple-500 hover:text-purple-700">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-stone-400 mt-4">
          New customer? <Link href="/register" className="text-stone-900 font-medium underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
