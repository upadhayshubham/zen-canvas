import { getProductBySlug } from '@/services/product.service';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return <ProductDetail product={product} />;
  } catch {
    notFound();
  }
}
