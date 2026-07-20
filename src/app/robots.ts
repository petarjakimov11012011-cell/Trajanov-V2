import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/site';

// robots.txt (Task 2). Allow crawling; point at the sitemap. /styleguide (both locale forms) is
// disallowed here as a courtesy, but the load-bearing signal is the per-page noindex (Task 3) — a
// Disallow only asks a crawler not to fetch, while noindex keeps a fetched page out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/styleguide', '/en/styleguide'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
