import { NextResponse } from 'next/server';
import { hashSecret } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const expectedSecret = process.env.ADMIN_SECRET;

    // Fail closed if the production/admin secret has not been configured.
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication is not configured.' },
        { status: 503 }
      );
    }

    if (!password || password !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials. Please try again.' },
        { status: 401 }
      );
    }

    const sessionToken = await hashSecret(expectedSecret);

    const response = NextResponse.json({ success: true, message: 'Authentication successful' });

    response.cookies.set({
      name: 'torcia_admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server authentication error' },
      { status: 500 }
    );
  }
}
