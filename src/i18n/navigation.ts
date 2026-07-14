import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Locale-aware wrappers around Next's navigation APIs. Use these instead of
// `next/link` / `next/navigation` so locale prefixing stays automatic.
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
