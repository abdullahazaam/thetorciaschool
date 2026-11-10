import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Session destroyed. Admin successfully logged out.',
  });

  // Thoroughly destroy the HTTP-only session cookie across all path contexts
  response.cookies.set({
    name: 'torcia_admin_session',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });

  // Prevent cache of sensitive session headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}
