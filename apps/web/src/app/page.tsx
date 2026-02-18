import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Product, PageResponse } from '@/types';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await api.get<PageResponse<Product>>('/products', { params: { size: 20 } });
    return res.data.content;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 mb-12">
        <h1 className="text-5xl font-bold text-stone-900 mb-4">Mandala Art Shop</h1>
        <p className="text-lg text-stone-500 max-w-xl mx-auto">
          Handcrafted mandala prints, posters and originals — each piece a meditation in form.
        </p>
      </section>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <p className="text-lg">No products yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-stone-100 relative overflow-hidden">
                {product.images[0] ? (
                  <Image src={product.images[0].secureUrl} alt={product.name}
                    fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">No image</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{product.categoryName}</p>
                <h3 className="font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">{product.name}</h3>
                {product.variants[0] && (
                  <p className="text-stone-700 font-medium mt-1">
                    from ${Number(product.variants[0].price).toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
