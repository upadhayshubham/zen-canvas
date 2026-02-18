'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Product, ProductVariant } from '@/types';
import { useCartStore } from '@/store/cart';
import { getSessionId } from '@/lib/session';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    api.get<Product>(`/products/${slug}`).then(r => {
      setProduct(r.data);
      setSelectedVariant(r.data.variants[0] ?? null);
    }).catch(() => router.push('/'));
  }, [slug, router]);

  if (!product) return <div className="text-center py-24 text-stone-400">Loading...</div>;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      const sessionId = getSessionId();
      await api.post('/cart/items', { variantId: selectedVariant.id, quantity }, {
        headers: { 'X-Session-Id': sessionId }
      });
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        sku: selectedVariant.sku,
        price: Number(selectedVariant.price),
        quantity,
        imageUrl: product.images[0]?.secureUrl,
        attributes: selectedVariant.attributes,
      });
      router.push('/cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Images */}
      <div>
        <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden relative mb-3">
          {product.images[activeImage] ? (
            <Image src={product.images[activeImage].secureUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">No image</div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={img.id} onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-stone-900' : 'border-transparent'}`}>
                <Image src={img.secureUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-stone-400 uppercase tracking-wide mb-1">{product.categoryName}</p>
          <h1 className="text-3xl font-bold text-stone-900">{product.name}</h1>
          {selectedVariant && (
            <p className="text-2xl font-semibold text-stone-700 mt-2">${Number(selectedVariant.price).toFixed(2)}</p>
          )}
        </div>

        {product.description && (
          <p className="text-stone-600 leading-relaxed">{product.description}</p>
        )}

        {/* Variants */}
        {product.variants.length > 1 && (
          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">Options</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(v => (
                <button key={v.id} onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${selectedVariant?.id === v.id ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-700 hover:border-stone-400'}`}>
                  {Object.values(v.attributes).join(' / ')} — ${Number(v.price).toFixed(2)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-stone-700">Qty</p>
          <div className="flex items-center border border-stone-200 rounded-lg">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-stone-600 hover:text-stone-900">−</button>
            <span className="px-4 py-2 text-stone-900 font-medium">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-stone-600 hover:text-stone-900">+</button>
          </div>
        </div>

        <button onClick={handleAddToCart} disabled={adding || !selectedVariant}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50">
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
