'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { getSessionId } from '@/lib/session';
import { CartResponse } from '@/types';

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get<CartResponse>('/cart', { headers: { 'X-Session-Id': getSessionId() } });
      setCart(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (itemId: string, quantity: number) => {
    await api.put(`/cart/items/${itemId}`, null, {
      params: { quantity },
      headers: { 'X-Session-Id': getSessionId() }
    });
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await api.delete(`/cart/items/${itemId}`, { headers: { 'X-Session-Id': getSessionId() } });
    fetchCart();
  };

  if (loading) return <div className="text-center py-24 text-stone-400">Loading cart...</div>;

  if (!cart || cart.items.length === 0) return (
    <div className="text-center py-24">
      <p className="text-stone-400 text-lg mb-4">Your cart is empty.</p>
      <Link href="/" className="text-stone-900 underline">Continue shopping</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Your Cart</h1>
      <div className="flex flex-col gap-4 mb-8">
        {cart.items.map(item => (
          <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-stone-100">
            <div className="flex-1">
              <p className="font-medium text-stone-900">{item.productName}</p>
              <p className="text-sm text-stone-400">{item.sku}</p>
              {Object.entries(item.attributes ?? {}).map(([k, v]) => (
                <span key={k} className="text-xs text-stone-500">{k}: {v} </span>
              ))}
            </div>
            <div className="flex items-center border border-stone-200 rounded-lg">
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1 text-stone-600 hover:text-stone-900">−</button>
              <span className="px-3 py-1">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1 text-stone-600 hover:text-stone-900">+</button>
            </div>
            <p className="w-20 text-right font-medium text-stone-900">${Number(item.subtotal).toFixed(2)}</p>
            <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-400 text-lg">×</button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <div className="flex justify-between text-lg font-semibold text-stone-900 mb-6">
          <span>Total</span>
          <span>${Number(cart.totalPrice).toFixed(2)}</span>
        </div>
        <Link href="/checkout"
          className="block w-full text-center bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-stone-700 transition-colors">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
