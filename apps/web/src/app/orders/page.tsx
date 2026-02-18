'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Order, PageResponse } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zc_token');
    if (!token) { router.push('/login'); return; }
    api.get<PageResponse<Order>>('/orders/my')
      .then(r => setOrders(r.data.content))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="text-center py-24 text-stone-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="mb-4">No orders yet.</p>
          <Link href="/" className="text-stone-900 underline">Start shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-stone-100 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-stone-400 font-mono">{order.id.slice(0, 8)}...</p>
                  <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-stone-100 text-stone-600'
                }`}>{order.status}</span>
              </div>
              <div className="text-sm text-stone-600 mb-2">
                {order.items.map(i => <span key={i.id}>{i.productName} ×{i.quantity} </span>)}
              </div>
              <p className="font-semibold text-stone-900">${Number(order.totalAmount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
