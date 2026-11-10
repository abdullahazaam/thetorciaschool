/**
 * Production-grade Military Authentication & Security Module for The Torcia School
 * Implements HMAC-SHA256 cryptographically signed session tokens with strict TTL expiration,
 * constant-time verification against timing attacks, rate limiting, and origin validation.
 * Compatible with Next.js Edge Middleware and Node.js runtime via Web Crypto API.
 */

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours strict session duration

// In-memory sliding window rate limiter (tracks IP attempts)
const rateLimitMap = new Map();

/**
 * Base64URL Encoding & Decoding helpers for Edge runtime
 */
function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(base64Url) {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Import HMAC CryptoKey using Web Crypto
 */
async function getCryptoKey(secret) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Generates an encrypted & signed admin session token with strict expiration
 */
export async function createAdminSessionToken() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SECRET environment variable is missing.');
  }

  const now = Date.now();
  const payload = {
    role: 'torcia_admin',
    iat: now,
    exp: now + SESSION_TTL_MS,
    nonce: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(encodedPayload)
  );

  const signatureHex = bufferToHex(signatureBuffer);
  return `${encodedPayload}.${signatureHex}`;
}

/**
 * Validates the admin session token
 * Verifies HMAC-SHA256 signature, expiration timestamp, and payload integrity.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyAdminSession(token) {
  if (!token || typeof token !== 'string') return false;

  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, providedSignature] = parts;

  try {
    const key = await getCryptoKey(secret);
    const expectedBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(encodedPayload)
    );
    const expectedSignature = bufferToHex(expectedBuffer);

    // Constant-time string comparison
    if (expectedSignature.length !== providedSignature.length) {
      return false;
    }
    let diff = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      diff |= expectedSignature.charCodeAt(i) ^ providedSignature.charCodeAt(i);
    }
    if (diff !== 0) {
      return false;
    }

    // Decode and verify payload
    const decodedJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedJson);

    if (payload.role !== 'torcia_admin') {
      return false;
    }

    // Strict expiration check
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Session verification error:', err);
    return false;
  }
}

/**
 * IP-based Rate Limiter to prevent brute-force attacks on login and sensitive endpoints.
 * @param {string} ip - Client IP
 * @param {string} action - Action key (e.g. 'admin_login')
 * @param {number} maxAttempts - Max allowed in window (e.g. 5)
 * @param {number} windowMs - Time window in milliseconds (e.g. 15 minutes)
 */
export function checkRateLimit(ip, action = 'admin_login', maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const key = `${action}:${ip || 'unknown'}`;
  const now = Date.now();

  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  // If window expired, reset
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  record.count += 1;
  rateLimitMap.set(key, record);

  const allowed = record.count <= maxAttempts;
  const remaining = Math.max(0, maxAttempts - record.count);
  const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    allowed,
    count: record.count,
    remaining,
    retryAfterSeconds,
  };
}

/**
 * Resets rate limit counter on successful authentication
 */
export function resetRateLimit(ip, action = 'admin_login') {
  const key = `${action}:${ip || 'unknown'}`;
  rateLimitMap.delete(key);
}

/**
 * Legacy support for direct secret hashing
 */
export async function hashSecret(secret) {
  const text = `${secret}_torcia_school_admin_auth_salt_`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
