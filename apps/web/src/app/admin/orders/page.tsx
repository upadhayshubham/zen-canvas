'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminOrders, updateOrderStatus } from '@/services/order.service';
import { Order } from '@/types';

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const STATUS_STYLES: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-stone-100 text-stone-600',
  CANCELLED: 'bg-red-100 text-red-600',
  REFUNDED: 'bg-purple-100 text-purple-600',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zc_token');
    if (!token) { router.push('/login'); return; }
    getAdminOrders()
      .then(r => setOrders(r.content))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
  };

  if (loading) return <div className="text-center py-24 text-stone-400">Loading orders...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
          <p className="text-sm text-stone-400">{orders.length} total orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {['Order', 'Customer', 'Date', 'Items', 'Total', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-stone-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-stone-900">{order.shippingName}</p>
                  <p className="text-xs text-stone-400">{order.shippingEmail}</p>
                </td>
                <td className="px-5 py-4 text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-stone-500">{order.items.length} item(s)</td>
                <td className="px-5 py-4 font-bold text-stone-900">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="px-5 py-4">
                  <select value={order.status} onChange={e => handleStatus(order.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-300 ${STATUS_STYLES[order.status]}`}>
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
