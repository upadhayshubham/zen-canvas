'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { getCart, updateCartItem, removeCartItem } from '@/services/cart.service';
import { getSessionId } from '@/lib/session';
import { CartResponse } from '@/types';

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart(getSessionId()).then(setCart).finally(() => setLoading(false));
  }, []);

  const handleQty = async (itemId: string, qty: number) => {
    setCart(await updateCartItem(getSessionId(), itemId, qty));
  };

  const handleRemove = async (itemId: string) => {
    setCart(await removeCartItem(getSessionId(), itemId));
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="animate-pulse space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-stone-100 rounded-xl" />)}
      </div>
    </div>
  );

  if (!cart || cart.items.length === 0) return (
    <div className="max-w-lg mx-auto text-center py-24">
      <ShoppingBag size={64} className="text-stone-200 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
      <p className="text-stone-400 mb-6">Looks like you haven&apos;t added anything yet.</p>
      <Link href="/" className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors">
        <ArrowLeft size={16}/> Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Shopping Cart ({cart.totalItems} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.items.map(item => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-stone-100">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-100" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productSlug}`}
                  className="font-semibold text-stone-900 hover:text-stone-600 text-sm truncate block">
                  {item.productName}
                </Link>
                <p className="text-xs text-stone-400 mt-0.5">{item.sku}</p>
                {Object.entries(item.attributes ?? {}).map(([k, v]) => (
                  <span key={k} className="text-xs text-stone-500 mr-2">{k}: {v}</span>
                ))}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-stone-200 rounded-lg text-sm">
                    <button onClick={() => handleQty(item.id, item.quantity - 1)} className="px-3 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50">-</button>
                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                    <button onClick={() => handleQty(item.id, item.quantity + 1)} className="px-3 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50">+</button>
                  </div>
                  <p className="font-bold text-stone-900">${Number(item.subtotal).toFixed(2)}</p>
                  <button onClick={() => handleRemove(item.id)} className="text-stone-300 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6 h-fit sticky top-24">
          <h2 className="font-bold text-stone-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>${Number(cart.totalPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Shipping</span>
              <span className="text-green-600">{Number(cart.totalPrice) >= 50 ? 'Free' : '$5.00'}</span>
            </div>
          </div>
          <div className="border-t border-stone-100 pt-3 mb-5 flex justify-between font-bold text-stone-900">
            <span>Total</span>
            <span>${(Number(cart.totalPrice) + (Number(cart.totalPrice) >= 50 ? 0 : 5)).toFixed(2)}</span>
          </div>
          <Link href="/checkout"
            className="block w-full text-center bg-stone-900 text-white py-3.5 rounded-xl font-semibold hover:bg-stone-700 transition-colors">
            Proceed to Checkout
          </Link>
          <Link href="/" className="flex items-center justify-center gap-1 text-sm text-stone-400 hover:text-stone-700 mt-3">
            <ArrowLeft size={14}/> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
