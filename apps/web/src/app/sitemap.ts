import type { MetadataRoute } from 'next';
import { getProducts, getCategories } from '@/services/product.service';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zencanvas.art';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ];

  try {
    const [productsPage, categories] = await Promise.all([
      getProducts({ page: 0, size: 100 }),
      getCategories(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = productsPage.content.map(p => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map(c => ({
      url: `${BASE_URL}/?category=${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch {
    return staticRoutes;
  }
}
