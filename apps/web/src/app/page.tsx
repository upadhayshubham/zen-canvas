import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 text-white px-8 py-20 text-center shadow-2xl shadow-purple-300">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-amber-400/20 rounded-full blur-xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
            <Sparkles size={12} /> Handcrafted with love & intention
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            Mandala Art for<br />
            <span className="text-amber-300">Mindful Spaces</span>
          </h1>
          <p className="text-purple-200 text-lg mb-10 max-w-xl mx-auto">
            Original prints, posters and wall art — each piece a meditation in sacred geometry and colour.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#products"
              className="inline-block bg-amber-400 text-amber-900 px-8 py-3.5 rounded-full font-bold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-900/30 text-sm">
              ✨ Shop Now
            </a>
            <a href="#products"
              className="inline-block bg-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/30 transition-colors border border-white/30 text-sm">
              View Collections
            </a>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: '🚚', title: 'Free Shipping', sub: 'On orders above $50', bg: 'from-violet-50 to-purple-50', border: 'border-purple-100' },
          { icon: '🎨', title: 'Handcrafted', sub: 'Original designs', bg: 'from-rose-50 to-pink-50', border: 'border-rose-100' },
          { icon: '♻️', title: 'Eco Printed', sub: 'Sustainable inks', bg: 'from-teal-50 to-emerald-50', border: 'border-teal-100' },
          { icon: '⭐', title: '5-Star Rated', sub: '500+ happy customers', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-100' },
        ].map(b => (
          <div key={b.title} className={`bg-gradient-to-br ${b.bg} border ${b.border} rounded-2xl p-4 text-center`}>
            <div className="text-2xl mb-1">{b.icon}</div>
            <p className="text-sm font-bold text-gray-800">{b.title}</p>
            <p className="text-xs text-gray-500">{b.sub}</p>
          </div>
        ))}
      </div>

      {/* Products */}
      <section id="products">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-purple-900">Our Collection</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </section>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-purple-100 animate-pulse">
          <div className="aspect-square bg-purple-100" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-purple-100 rounded w-1/2" />
            <div className="h-4 bg-purple-100 rounded w-3/4" />
            <div className="h-4 bg-purple-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
