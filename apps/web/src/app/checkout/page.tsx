'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { createPaymentIntent } from '@/services/order.service';
import { getSessionId } from '@/lib/session';

const FIELDS = [
  { label: 'Full Name', name: 'shippingName' as const },
  { label: 'Email Address', name: 'shippingEmail' as const, type: 'email' },
  { label: 'Street Address', name: 'shippingAddress' as const },
  { label: 'City', name: 'shippingCity' as const },
  { label: 'Country', name: 'shippingCountry' as const },
  { label: 'Postcode / ZIP', name: 'shippingPostcode' as const },
];

type Form = { shippingName: string; shippingEmail: string; shippingAddress: string; shippingCity: string; shippingCountry: string; shippingPostcode: string; };

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({ shippingName: '', shippingEmail: '', shippingAddress: '', shippingCity: '', shippingCountry: '', shippingPostcode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await createPaymentIntent(getSessionId(), form);
      localStorage.setItem('zc_client_secret', result.clientSecret);
      localStorage.setItem('zc_payment_intent', result.paymentIntentId);
      router.push('/checkout/confirmation');
    } catch {
      setError('Failed to create order. Make sure your cart is not empty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-2">Checkout</h1>
      <p className="text-stone-400 text-sm mb-8">Enter your shipping details to continue to payment.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {FIELDS.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-stone-700 mb-1">{f.label}</label>
              <input type={f.type ?? 'text'} required
                value={form[f.name]}
                onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
            </div>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50">
          <Lock size={16} />
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
}
