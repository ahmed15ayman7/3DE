import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = new Set([
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // لو الصفحة عامة، نكمل على طول
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // التحقق من وجود توكن JWT
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // لو مفيش توكن، نرجع لصفحة تسجيل الدخول
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/signin';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/|favicon.ico).*)'],
};
