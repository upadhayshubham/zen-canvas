'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { addToCart } from '@/services/cart.service';
import { getSessionId } from '@/lib/session';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';

interface Props { product: Product; }

const CATEGORY_COLORS: Record<string, string> = {
  'Wall Art': 'bg-violet-100 text-violet-700',
  'Posters': 'bg-fuchsia-100 text-fuchsia-700',
  'Originals': 'bg-rose-100 text-rose-700',
  'Gift Sets': 'bg-amber-100 text-amber-700',
};

export default function ProductCard({ product }: Props) {
  const [adding, setAdding] = useState(false);
  const [liked, setLiked] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const firstVariant = product.variants[0];
  const image = product.images[0];
  const categoryColor = CATEGORY_COLORS[product.categoryName] ?? 'bg-purple-100 text-purple-700';

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
      className="group bg-white rounded-2xl overflow-hidden border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-fuchsia-50 overflow-hidden">
        {image ? (
          <Image src={image.secureUrl} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🔮</div>
        )}

        {/* Wishlist */}
        <button onClick={(e) => { e.preventDefault(); setLiked(l => !l); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={14} className={liked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
        </button>

        {/* Quick add */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <button onClick={handleQuickAdd} disabled={adding}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-semibold px-5 py-2 rounded-full shadow-lg hover:from-violet-700 hover:to-fuchsia-700 transition-all flex items-center gap-1.5 disabled:opacity-60">
            <ShoppingCart size={12} />
            {adding ? 'Adding...' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-2 ${categoryColor}`}>
          {product.categoryName}
        </span>
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-snug flex-1">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          {firstVariant ? (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-purple-700">
                ${Number(firstVariant.price).toFixed(2)}
              </span>
              {product.variants.length > 1 && (
                <span className="text-xs text-gray-400">{product.variants.length} sizes</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">No variants</span>
          )}
        </div>
      </div>
    </Link>
  );
}
