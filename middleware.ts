import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/landing', '/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user has the convex configuration cookie
  const userId = request.cookies.get('convex_user_id')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  if (!userId && !isPublicRoute) {
    // If user is not authenticated and trying to access a protected route
    // Redirect to the auth page instead of landing to keep the experience clean
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  if (userId && isPublicRoute) {
    // If user is authenticated and trying to access a public page (e.g., login)
    // Send them straight to the dashboard
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Ensure middleware only fires on necessary routes, avoiding static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
