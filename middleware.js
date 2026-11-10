import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

// Public endpoints that do not require admin session for POST
const PUBLIC_POST_ENDPOINTS = [
  '/api/admin/login',
  '/api/admissions',
  '/api/admission',
  '/api/contact',
  '/api/inquiries',
  '/api/chat',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const sessionCookie = request.cookies.get('torcia_admin_session')?.value;
  const isAuthenticated = await verifyAdminSession(sessionCookie);

  // 1. Admin Page Routes (/admin/...)
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

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

      const redirectResponse = NextResponse.redirect(loginUrl);
      // Clean up stale or expired cookie
      if (sessionCookie) {
        redirectResponse.cookies.set({
          name: 'torcia_admin_session',
          value: '',
          httpOnly: true,
          expires: new Date(0),
          path: '/',
        });
      }
      return redirectResponse;
    }

    return NextResponse.next();
  }

  // 2. Admin API Routes (/api/admin/...)
  if (pathname.startsWith('/api/admin')) {
    // Login route is public
    if (pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin session required or expired.' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 3. Admin Mutation Protection on Core APIs (POST, PUT, PATCH, DELETE)
  if (pathname.startsWith('/api/')) {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (isMutation) {
      // Check if it's a public student/parent submission
      const isPublicPost =
        method === 'POST' &&
        (PUBLIC_POST_ENDPOINTS.includes(pathname) || pathname === '/api/submissions');

      if (!isPublicPost) {
        // Enforce admin authentication for mutations (upload, edit, delete, patch status)
        if (!isAuthenticated) {
          return NextResponse.json(
            {
              success: false,
              error: 'Forbidden: Valid administrator authentication is required for this action.',
            },
            { status: 401 }
          );
        }

        // CSRF / Origin validation for mutations
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');
        if (origin && host) {
          try {
            const originHost = new URL(origin).host;
            if (originHost !== host) {
              return NextResponse.json(
                { success: false, error: 'Cross-Site Request Forgery (CSRF) blocked.' },
                { status: 403 }
              );
            }
          } catch (e) {
            // Ignore URL parsing errors on localhost
          }
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
