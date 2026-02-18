'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import CartDrawer from './CartDrawer';

export default function Header() {
  const router = useRouter();
  const totalItems = useCartStore(s => s.totalItems());
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-stone-900 text-stone-200 text-xs text-center py-2">
        Free shipping on orders above $50 &nbsp;·&nbsp; Handcrafted with love
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main nav row */}
          <div className="h-16 flex items-center gap-4">
            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(o => !o)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="text-2xl font-bold tracking-tight text-stone-900 mr-4">
              Zen Canvas
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center border border-stone-200 rounded-full px-4 py-2 gap-2 hover:border-stone-400 transition-colors">
              <Search size={16} className="text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="Search mandalas, prints, sizes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent text-stone-900 placeholder-stone-400"
              />
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-4 ml-auto md:ml-4">
              <Link href="/login" className="hidden md:flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900">
                <User size={18} /> <span>Account</span>
              </Link>
              <button className="hidden md:block text-stone-600 hover:text-stone-900">
                <Heart size={18} />
              </button>
              <button onClick={() => setCartOpen(true)} className="relative text-stone-600 hover:text-stone-900 flex items-center gap-1">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category nav */}
          <nav className="hidden md:flex items-center gap-8 pb-3 text-sm">
            {['All Products', 'Wall Art', 'Posters', 'Originals', 'Gift Sets'].map(cat => (
              <Link key={cat}
                href={cat === 'All Products' ? '/' : `/?category=${encodeURIComponent(cat)}`}
                className="text-stone-600 hover:text-stone-900 font-medium transition-colors">
                {cat}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 px-4 py-4 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="flex items-center border border-stone-200 rounded-full px-4 py-2 gap-2">
              <Search size={16} className="text-stone-400" />
              <input type="text" placeholder="Search..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent" />
            </form>
            <Link href="/" className="text-sm text-stone-700 py-1" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
            <Link href="/login" className="text-sm text-stone-700 py-1" onClick={() => setMobileMenuOpen(false)}>Account</Link>
            <Link href="/orders" className="text-sm text-stone-700 py-1" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
