'use client';
import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function Header() {
  const totalItems = useCartStore(s => s.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
          Zen Canvas
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm text-stone-600 hover:text-stone-900">Shop</Link>
          <Link href="/orders" className="text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1">
            <User size={16}/> Account
          </Link>
          <Link href="/cart" className="relative text-stone-600 hover:text-stone-900">
            <ShoppingCart size={20}/>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
