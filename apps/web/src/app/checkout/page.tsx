'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getSessionId } from '@/lib/session';

interface Field { label: string; name: string; type?: string; }

const FIELDS: Field[] = [
  { label: 'Full Name', name: 'shippingName' },
  { label: 'Email', name: 'shippingEmail', type: 'email' },
  { label: 'Address', name: 'shippingAddress' },
  { label: 'City', name: 'shippingCity' },
  { label: 'Country', name: 'shippingCountry' },
  { label: 'Postcode', name: 'shippingPostcode' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/checkout/payment-intent', form, {
        headers: { 'X-Session-Id': getSessionId() }
      });
      // Store client secret and redirect to payment page
      localStorage.setItem('zc_client_secret', res.data.clientSecret);
      localStorage.setItem('zc_payment_intent', res.data.paymentIntentId);
      router.push('/checkout/payment');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 flex flex-col gap-4">
        {FIELDS.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-stone-700 mb-1">{f.label}</label>
            <input
              type={f.type ?? 'text'}
              required
              value={form[f.name] ?? ''}
              onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50 mt-2">
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
}
