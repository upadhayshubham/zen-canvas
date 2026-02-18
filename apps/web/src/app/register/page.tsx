'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      localStorage.setItem('zc_token', res.token);
      router.push('/orders');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Create Account</h1>
        <p className="text-stone-400 text-sm mt-1">Join Zen Canvas today</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {(['firstName', 'lastName'] as const).map(f => (
              <div key={f}>
                <label className="block text-sm font-medium text-stone-700 mb-1 capitalize">{f === 'firstName' ? 'First Name' : 'Last Name'}</label>
                <input type="text" required value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <input type="password" required minLength={8} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
            <p className="text-xs text-stone-400 mt-1">Minimum 8 characters</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-stone-400 mt-4">
          Already have an account? <Link href="/login" className="text-stone-900 font-medium underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
