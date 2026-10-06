import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const sessionCookie = request.cookies.get('torcia_admin_session')?.value;
    const isAuthenticated = await verifyAdminSession(sessionCookie);

    // If on login page and already authenticated, redirect to /admin dashboard
    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If on login page and not authenticated, allow through
    if (isLoginPage) {
      return NextResponse.next();
    }

    // If on protected admin route and not authenticated, redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
