'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import { getSessionId } from '@/lib/session';
import { getCart, updateCartItem, removeCartItem } from '@/services/cart.service';
import { CartResponse } from '@/types';

interface Props { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: Props) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try { setCart(await getCart(getSessionId())); }
    finally { setLoading(false); }
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
      {open && <div className="fixed inset-0 bg-purple-900/30 backdrop-blur-sm z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl shadow-purple-200 flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} /> Your Cart
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-gradient-to-b from-purple-50/50 to-white">
          {loading && <p className="text-center text-purple-400 py-8">Loading...</p>}
          {!loading && (!cart || cart.items.length === 0) && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🛒</div>
              <p className="text-purple-400 font-medium">Your cart is empty.</p>
              <p className="text-sm text-gray-400 mt-1">Add some beautiful art!</p>
            </div>
          )}
          {!loading && cart && cart.items.map(item => (
            <div key={item.id} className="flex gap-3 py-4 border-b border-purple-50">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-fuchsia-100 shrink-0">
                {item.imageUrl
                  ? <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl">🔮</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{item.productName}</p>
                <p className="text-xs text-purple-400">{item.sku}</p>
                <p className="text-sm font-bold text-purple-700 mt-0.5">${Number(item.subtotal).toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center border border-purple-200 rounded-lg text-sm bg-white">
                    <button onClick={() => handleQty(item.id, item.quantity - 1)} className="px-2 py-1 text-purple-500 hover:text-purple-800">−</button>
                    <span className="px-2 font-semibold text-purple-900">{item.quantity}</span>
                    <button onClick={() => handleQty(item.id, item.quantity + 1)} className="px-2 py-1 text-purple-500 hover:text-purple-800">+</button>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="text-xs text-gray-300 hover:text-red-500 transition-colors">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="px-5 py-4 border-t border-purple-100 bg-white">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span className="font-bold text-purple-900">${Number(cart.totalPrice).toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
              <Sparkles size={10} className="text-amber-400" /> Shipping calculated at checkout
            </p>
            <Link href="/checkout" onClick={onClose}
              className="block w-full text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3.5 rounded-xl font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg shadow-purple-200 text-sm">
              Checkout · ${Number(cart.totalPrice).toFixed(2)}
            </Link>
            <button onClick={onClose} className="block w-full text-center text-purple-400 text-sm mt-2 hover:text-purple-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
