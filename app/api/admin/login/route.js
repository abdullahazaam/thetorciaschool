import { NextResponse } from 'next/server';
import { createAdminSessionToken, checkRateLimit, resetRateLimit } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Extract IP for rate limiting and brute force protection
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

    // Rate Limiting: Max 5 attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(clientIp, 'admin_login', 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Security lock engaged. Please retry in ${rateCheck.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const { password } = await request.json();
    const expectedSecret = process.env.ADMIN_SECRET;

    // Fail closed if the production/admin secret has not been configured
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication is not configured on the server.' },
        { status: 503 }
      );
    }

    if (!password || password !== expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid admin credentials. Access denied. (${rateCheck.remaining} attempts remaining before temporary lockout).`,
        },
        { status: 401 }
      );
    }

    // Reset rate limiter on valid login
    resetRateLimit(clientIp, 'admin_login');

    // Generate cryptographically signed HMAC-SHA256 session token with strict 8-hour expiry
    const sessionToken = await createAdminSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful. Secure session initialized.',
    });

    response.cookies.set({
      name: 'torcia_admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours strict
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server authentication processing error' },
      { status: 500 }
    );
  }
}
