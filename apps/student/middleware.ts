import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authService } from '@3de/auth';

export default async function middleware(req: NextRequest) {
  // Skip middleware for auth routes, API routes, and static files
  if (
    req.nextUrl.pathname.startsWith('/auth') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/public') ||
    req.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const isAuthenticated = await authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to login page
    const loginUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has student role
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'STUDENT') {
    // Redirect to unauthorized page
    const unauthorizedUrl = new URL('/unauthorized', req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth (authentication routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
}; 