'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Order, PageResponse } from '@/types';

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zc_token');
    if (!token) { router.push('/login'); return; }
    api.get<PageResponse<Order>>('/admin/orders', { params: { size: 50 } })
      .then(r => setOrders(r.data.content))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  const updateStatus = async (orderId: string, status: string) => {
    await api.patch(`/admin/orders/${orderId}/status`, null, { params: { status } });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
  };

  if (loading) return <div className="text-center py-24 text-stone-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Admin — Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl border border-stone-100 overflow-hidden">
          <thead className="bg-stone-50 text-xs text-stone-500 uppercase">
            <tr>
              {['Order ID', 'Customer', 'Date', 'Total', 'Items', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono text-xs text-stone-500">{order.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-sm text-stone-700">{order.shippingName}</td>
                <td className="px-4 py-3 text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium text-stone-900">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-stone-500">{order.items.length} item(s)</td>
                <td className="px-4 py-3">
                  <select value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="text-sm border border-stone-200 rounded-lg px-2 py-1 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
