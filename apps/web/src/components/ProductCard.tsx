'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { addToCart } from '@/services/cart.service';
import { getSessionId } from '@/lib/session';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const firstVariant = product.variants[0];
  const image = product.images[0];

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariant) return;
    setAdding(true);
    try {
      await addToCart(getSessionId(), firstVariant.id, 1);
      addItem({
        variantId: firstVariant.id,
        productId: product.id,
        name: product.name,
        sku: firstVariant.sku,
        price: Number(firstVariant.price),
        quantity: 1,
        imageUrl: image?.secureUrl,
        attributes: firstVariant.attributes,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        {image ? (
          <Image src={image.secureUrl} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-stone-300 text-sm">No image</span>
          </div>
        )}
        {/* Quick add button */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <button onClick={handleQuickAdd} disabled={adding}
            className="bg-white text-stone-900 text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-stone-900 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-60">
            <ShoppingCart size={13} />
            {adding ? 'Adding...' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">{product.categoryName}</p>
        <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors leading-snug flex-1">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          {firstVariant ? (
            <div>
              <span className="text-base font-bold text-stone-900">${Number(firstVariant.price).toFixed(2)}</span>
              {product.variants.length > 1 && (
                <span className="text-xs text-stone-400 ml-1">{product.variants.length} options</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-stone-400">No variants</span>
          )}
        </div>
      </div>
    </Link>
  );
}
