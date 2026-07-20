import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths except API routes, the /og share-card generator (a non-localised route handler —
  // 2.04), Next internals, and files with an extension (e.g. favicon.ico, sitemap.xml, robots.txt).
  // Keeps locale routing off static assets and the OG endpoint (without this, next-intl treats /og as a
  // MK-default page and 404s it — the card never renders for a scraper).
  matcher: '/((?!api|og|_next|_vercel|.*\\..*).*)',
};
