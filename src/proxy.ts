import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths except API routes, Next internals, and files with an
  // extension (e.g. favicon.ico). Keeps locale routing off static assets.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
