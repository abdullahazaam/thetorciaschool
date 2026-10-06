/**
 * Authentication and session helpers for The Torcia School Admin
 * Uses Web Crypto API compatible with Next.js Middleware (Edge & Node.js).
 */

const SALT = '_torcia_school_admin_auth_salt_';

export async function hashSecret(secret) {
  const text = `${secret}${SALT}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminSession(token) {
  if (!token) return false;
  const adminSecret = process.env.ADMIN_SECRET || 'torcia_secure_admin_secret_key_2026';
  const expectedHash = await hashSecret(adminSecret);
  return token === expectedHash;
}
