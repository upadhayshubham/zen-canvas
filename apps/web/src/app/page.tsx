import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-stone-900 text-white rounded-3xl overflow-hidden mb-10 px-8 py-16 text-center">
        <div className="relative z-10">
          <p className="text-stone-400 text-sm uppercase tracking-widest mb-3">Handcrafted with intention</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Mandala Art for<br />Mindful Spaces</h1>
          <p className="text-stone-300 text-lg mb-8 max-w-lg mx-auto">
            Original prints, posters and wall art — each piece a meditation in sacred geometry.
          </p>
          <a href="#products"
            className="inline-block bg-white text-stone-900 px-8 py-3 rounded-full font-semibold hover:bg-stone-100 transition-colors">
            Shop Now
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products">
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
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-100 animate-pulse">
          <div className="aspect-square bg-stone-200" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-stone-200 rounded w-1/2" />
            <div className="h-4 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
