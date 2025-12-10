import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from "better-auth/cookies";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle internationalization first - this will redirect /dashboard to /en/dashboard
  const intlResponse = intlMiddleware(request);
  
  // If intl middleware wants to redirect, let it handle that first
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }
  
  // Now check for authentication on the localized path
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // If no locale in path, let intl middleware handle it
  if (!pathnameHasLocale && pathname !== '/') {
    return intlResponse;
  }
  
  let locale = routing.defaultLocale;
  if (pathnameHasLocale) {
    const extractedLocale = pathname.split('/')[1];
    if (routing.locales.includes(extractedLocale as any)) {
      locale = extractedLocale as typeof routing.defaultLocale;
    }
  }
  
  // Define protected and public routes
  const protectedRoutes = ['/dashboard'];
  const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/confirm'];
  
  // Check if current path is protected or public (without locale prefix)
  const pathWithoutLocale = pathnameHasLocale ? pathname.slice(3) : pathname;
  const isProtectedRoute = protectedRoutes.some(route => pathWithoutLocale.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathWithoutLocale.startsWith(route));
  
  // Check for session cookie (optimistic check)
  const sessionCookie = getSessionCookie(request);
  
  // Redirect logic
  if (isProtectedRoute && !sessionCookie) {
    // Redirect unauthenticated users from protected routes to sign-in
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  if (isPublicRoute && sessionCookie) {
    // Redirect authenticated users from public routes to dashboard
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
