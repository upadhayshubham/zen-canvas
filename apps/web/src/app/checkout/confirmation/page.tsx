'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    if (!paymentIntentId) {
      setStatus('error');
      return;
    }
    // Stripe appends payment_intent to the return_url automatically.
    // The webhook has already updated the order on the server side.
    // We just confirm to the user that payment was received.
    localStorage.removeItem('zc_client_secret');
    localStorage.removeItem('zc_payment_intent');
    // Clear Zustand cart
    try {
      const raw = localStorage.getItem('zc-cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.state) parsed.state.items = [];
        localStorage.setItem('zc-cart', JSON.stringify(parsed));
      }
    } catch { /* ignore */ }
    setStatus('success');
  }, [paymentIntentId]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-purple-400" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-8">We could not confirm your payment. If money was charged, please contact support.</p>
        <Link href="/" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-16">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full p-6">
          <CheckCircle size={56} className="text-violet-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-purple-900 mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 mb-2 text-lg">Thank you for your purchase.</p>
      <p className="text-gray-400 text-sm mb-8">
        Your mandala art is on its way. You&apos;ll receive an email confirmation shortly.
      </p>

      {paymentIntentId && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl px-6 py-4 mb-8 text-left">
          <p className="text-xs text-purple-400 uppercase tracking-wide font-semibold mb-1">Payment reference</p>
          <p className="font-mono text-sm text-purple-700 truncate">{paymentIntentId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-200">
          <Package size={16} /> View My Orders
        </Link>
        <Link href="/"
          className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-6 py-3.5 rounded-full font-semibold hover:bg-purple-50 transition-colors">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
