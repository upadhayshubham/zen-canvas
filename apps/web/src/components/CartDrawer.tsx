'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import { getSessionId } from '@/lib/session';
import { getCart, updateCartItem, removeCartItem } from '@/services/cart.service';
import { CartResponse } from '@/types';

interface Props { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: Props) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      setCart(await getCart(getSessionId()));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (open) fetchCart(); }, [open, fetchCart]);

  const handleQty = async (itemId: string, qty: number) => {
    setCart(await updateCartItem(getSessionId(), itemId, qty));
  };

  const handleRemove = async (itemId: string) => {
    setCart(await removeCartItem(getSessionId(), itemId));
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShoppingBag size={20} /> Your Cart
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900"><X size={20} /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && <p className="text-center text-stone-400 py-8">Loading...</p>}
          {!loading && (!cart || cart.items.length === 0) && (
            <div className="text-center py-16">
              <ShoppingBag size={40} className="text-stone-200 mx-auto mb-3" />
              <p className="text-stone-400">Your cart is empty.</p>
            </div>
          )}
          {!loading && cart && cart.items.map(item => (
            <div key={item.id} className="flex gap-3 py-4 border-b border-stone-50">
              {item.imageUrl ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{item.productName}</p>
                <p className="text-xs text-stone-400">{item.sku}</p>
                <p className="text-sm font-semibold text-stone-900 mt-1">${Number(item.subtotal).toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border border-stone-200 rounded-lg text-sm">
                    <button onClick={() => handleQty(item.id, item.quantity - 1)} className="px-2 py-1 text-stone-500 hover:text-stone-900">−</button>
                    <span className="px-2">{item.quantity}</span>
                    <button onClick={() => handleQty(item.id, item.quantity + 1)} className="px-2 py-1 text-stone-500 hover:text-stone-900">+</button>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="text-xs text-stone-400 hover:text-red-500">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-100 bg-stone-50">
            <div className="flex justify-between text-sm text-stone-500 mb-1">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span className="font-semibold text-stone-900">${Number(cart.totalPrice).toFixed(2)}</span>
            </div>
            <p className="text-xs text-stone-400 mb-4">Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={onClose}
              className="block w-full text-center bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors text-sm">
              Checkout · ${Number(cart.totalPrice).toFixed(2)}
            </Link>
            <button onClick={onClose} className="block w-full text-center text-stone-500 text-sm mt-2 hover:text-stone-900">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
