'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, Sparkles } from 'lucide-react';
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
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white text-xs text-center py-2 font-medium">
        <Sparkles className="inline w-3 h-3 mr-1" />
        Free shipping on orders above $50 · Handcrafted with love & intention
        <Sparkles className="inline w-3 h-3 ml-1" />
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm shadow-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center gap-4">
            {/* Mobile menu */}
            <button className="md:hidden text-purple-600" onClick={() => setMobileMenuOpen(o => !o)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Zen Canvas
              </span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center border-2 border-purple-100 rounded-full px-4 py-2 gap-2 hover:border-purple-300 focus-within:border-purple-400 transition-colors bg-purple-50/50">
              <Search size={16} className="text-purple-400 shrink-0" />
              <input type="text" placeholder="Search mandalas, prints, sizes..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent text-purple-900 placeholder-purple-300" />
            </form>

            {/* Icons */}
            <div className="flex items-center gap-3 ml-auto md:ml-4">
              <Link href="/login" className="hidden md:flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium">
                <User size={18} /> <span>Account</span>
              </Link>
              <button onClick={() => setCartOpen(true)}
                className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-2 rounded-full hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-md shadow-purple-200">
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category nav */}
          <nav className="hidden md:flex items-center gap-1 pb-3">
            {[
              { label: 'All Products', href: '/', color: 'text-purple-700 hover:bg-purple-50' },
              { label: '🖼 Wall Art', href: '/?category=wall-art', color: 'text-violet-700 hover:bg-violet-50' },
              { label: '📜 Posters', href: '/?category=posters', color: 'text-fuchsia-700 hover:bg-fuchsia-50' },
              { label: '✨ Originals', href: '/?category=originals', color: 'text-rose-700 hover:bg-rose-50' },
              { label: '🎁 Gift Sets', href: '/?category=gift-sets', color: 'text-amber-700 hover:bg-amber-50' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${item.color}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100 px-4 py-4 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="flex items-center border-2 border-purple-100 rounded-full px-4 py-2 gap-2">
              <Search size={16} className="text-purple-400" />
              <input type="text" placeholder="Search..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent" />
            </form>
            {['/', '/login', '/orders'].map((href, i) => (
              <Link key={href} href={href} className="text-sm text-purple-700 py-1 font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                {['🏠 Shop', '👤 Account', '📦 My Orders'][i]}
              </Link>
            ))}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
