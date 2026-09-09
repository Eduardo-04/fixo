import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chambitas.shop';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/portal/dashboard/'],
    },
    sitemap: `${URL}/sitemap.xml`,
  };
}
