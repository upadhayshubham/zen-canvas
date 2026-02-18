'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { getMyOrders } from '@/services/order.service';
import { Order } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-stone-100 text-stone-600',
  CANCELLED: 'bg-red-100 text-red-600',
  REFUNDED: 'bg-purple-100 text-purple-600',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zc_token');
    if (!token) { router.push('/login'); return; }
    getMyOrders()
      .then(r => setOrders(r.content))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="max-w-2xl mx-auto py-12 space-y-4 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-stone-100 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900">My Orders</h1>
        <Link href="/" className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700">
          <ArrowLeft size={14}/> Shop
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={56} className="text-stone-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-stone-900 mb-2">No orders yet</h2>
          <p className="text-stone-400 mb-6">Your completed orders will appear here.</p>
          <Link href="/" className="inline-block bg-stone-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors text-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-stone-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_STYLES[order.status] ?? 'bg-stone-100 text-stone-500'}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-stone-600 mb-3 space-y-0.5">
                {order.items.map(i => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.productName} <span className="text-stone-400">x{i.quantity}</span></span>
                    <span>${Number(i.unitPrice * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-50 pt-3 flex justify-between items-center">
                <span className="text-xs text-stone-400">{order.items.length} item(s)</span>
                <span className="font-bold text-stone-900">${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
