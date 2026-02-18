'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Shield, Truck, RefreshCw } from 'lucide-react';
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
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-700 flex items-center gap-1"><ArrowLeft size={14}/> Shop</Link>
        <span>/</span>
        <span className="text-stone-500">{product.categoryName}</span>
        <span>/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 relative">
            {product.images[activeImage] ? (
              <Image src={product.images[activeImage].secureUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">No image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-stone-900' : 'border-transparent'}`}>
                  <Image src={img.secureUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-widest">{product.categoryName}</span>
            <h1 className="text-3xl font-bold text-stone-900 mt-1">{product.name}</h1>
            <p className="text-2xl font-bold text-stone-900 mt-2">
              ${Number(selectedVariant?.price ?? 0).toFixed(2)}
            </p>
          </div>

          {product.description && (
            <p className="text-stone-600 leading-relaxed text-sm">{product.description}</p>
          )}

          {product.variants.length > 1 && (
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                Size / Option: <span className="font-normal text-stone-500">
                  {Object.values(selectedVariant?.attributes ?? {}).join(' / ')}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button key={v.id} onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedVariant?.id === v.id ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-700 hover:border-stone-500'}`}>
                    {Object.values(v.attributes).join(' / ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-stone-700">Quantity</p>
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-stone-600 hover:bg-stone-50 text-lg">-</button>
              <span className="px-4 py-2 font-semibold text-stone-900 min-w-[2.5rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-stone-600 hover:bg-stone-50 text-lg">+</button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} disabled={adding || !selectedVariant}
              className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:opacity-50 text-sm">
              <ShoppingCart size={18} />
              {adding ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
            <button className="w-full border border-stone-900 text-stone-900 py-4 rounded-xl font-semibold hover:bg-stone-50 transition-colors text-sm">
              Buy It Now
            </button>
          </div>

          <div className="border-t border-stone-100 pt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'Orders $50+' },
              { icon: Shield, label: 'Secure Payment', sub: 'SSL encrypted' },
              { icon: RefreshCw, label: 'Easy Returns', sub: '30-day policy' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={18} className="text-stone-400" />
                <p className="text-xs font-semibold text-stone-700">{label}</p>
                <p className="text-xs text-stone-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
