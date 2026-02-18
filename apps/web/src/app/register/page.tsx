'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface RegisterField {
  key: 'email' | 'password' | 'firstName' | 'lastName';
  label: string;
  type?: string;
}

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
      const res = await api.post('/auth/register', form);
      localStorage.setItem('zc_token', res.data.token);
      router.push('/orders');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const fields: RegisterField[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold text-stone-900 mb-8 text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 flex flex-col gap-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-stone-700 mb-1">{f.label}</label>
            <input type={f.type ?? 'text'} required value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-stone-500">
          Have an account? <Link href="/login" className="text-stone-900 underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
