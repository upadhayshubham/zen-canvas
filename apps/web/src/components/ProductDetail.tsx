'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Truck, Shield, RefreshCw, Heart, Star } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { addToCart } from '@/services/cart.service';
import { getSessionId } from '@/lib/session';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';

interface Props { product: Product; }

export default function ProductDetail({ product }: Props) {
  const router = useRouter();
  const addItem = useCartStore(s => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addToCart(getSessionId(), selectedVariant.id, quantity);
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
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-purple-400 mb-6">
        <Link href="/" className="hover:text-purple-700 flex items-center gap-1 font-medium">
          <ArrowLeft size={14}/> Shop
        </Link>
        <span>/</span>
        <span className="text-purple-500">{product.categoryName}</span>
        <span>/</span>
        <span className="text-purple-800 font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-fuchsia-50 relative shadow-xl shadow-purple-100">
            {product.images[activeImage] ? (
              <Image src={product.images[activeImage].secureUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🔮</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-purple-500' : 'border-transparent'}`}>
                  <Image src={img.secureUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-block text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-2">
              {product.categoryName}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            {/* Stars */}
            <div className="flex items-center gap-1 mt-2">
              {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
              <span className="text-sm text-gray-400 ml-1">(24 reviews)</span>
            </div>
            <p className="text-3xl font-bold mt-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              ${Number(selectedVariant?.price ?? 0).toFixed(2)}
            </p>
          </div>

          {product.description && (
            <p className="text-gray-600 leading-relaxed text-sm bg-purple-50 rounded-xl p-4 border border-purple-100">
              {product.description}
            </p>
          )}

          {/* Variants */}
          {product.variants.length > 1 && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">
                Select Size: <span className="font-normal text-purple-600">
                  {Object.values(selectedVariant?.attributes ?? {}).join(' / ')}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button key={v.id} onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-md shadow-purple-200'
                        : 'border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50'
                    }`}>
                    {Object.values(v.attributes).join(' / ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-gray-700">Quantity</p>
            <div className="flex items-center border-2 border-purple-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 font-bold text-lg">−</button>
              <span className="px-4 py-2 font-bold text-purple-900 min-w-[2.5rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 font-bold text-lg">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} disabled={adding || !selectedVariant}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-4 rounded-xl font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50">
              <ShoppingCart size={18} />
              {adding ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
            <div className="flex gap-3">
              <button className="flex-1 border-2 border-purple-600 text-purple-700 py-3.5 rounded-xl font-bold hover:bg-purple-50 transition-colors">
                Buy It Now
              </button>
              <button onClick={() => setLiked(l => !l)}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${liked ? 'bg-rose-50 border-rose-300' : 'border-purple-200 hover:border-rose-300'}`}>
                <Heart size={20} className={liked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
              </button>
            </div>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 border-t border-purple-100 pt-4">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'Orders $50+', color: 'text-violet-500' },
              { icon: Shield, label: 'Secure Payment', sub: 'SSL encrypted', color: 'text-teal-500' },
              { icon: RefreshCw, label: 'Easy Returns', sub: '30-day policy', color: 'text-amber-500' },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center bg-purple-50/50 rounded-xl p-3">
                <Icon size={18} className={color} />
                <p className="text-xs font-bold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
