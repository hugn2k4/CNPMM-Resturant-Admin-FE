import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = ['/dashboard'];
  
  // Paths that are only for public (unauthenticated) users
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // If path is protected and no token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // If path is auth (login/register) and token exists, redirect to dashboard
  if (isAuthPath && token) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register', 
    '/forgot-password', 
    '/reset-password'
  ],
};
