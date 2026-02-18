import type { Metadata } from 'next';
import { getProductBySlug } from '@/services/product.service';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    const image = product.images?.[0]?.secureUrl;
    const price = product.variants?.[0]?.price;
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        type: 'website',
        ...(image && { images: [{ url: image, alt: product.name }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        ...(image && { images: [image] }),
      },
      other: price
        ? { 'product:price:amount': String(price), 'product:price:currency': 'USD' }
        : {},
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return <ProductDetail product={product} />;
  } catch {
    notFound();
  }
}
