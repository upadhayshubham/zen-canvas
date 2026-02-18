import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zencanvas.art';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/orders/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
