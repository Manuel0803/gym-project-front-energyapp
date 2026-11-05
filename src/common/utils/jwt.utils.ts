export interface DecodedToken {
  sub?: string;
  uuid?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  gymUuid?: string;
  requiresOnboarding?: boolean;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Safely decodes a JWT token payload across Edge runtime, Browser, and Node environments.
 * Does not require external dependencies.
 *
 * @param token - The raw JWT string.
 * @returns The decoded payload object or null if parsing fails.
 */
export function decodeJwt(token: string | null | undefined): DecodedToken | null {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    let jsonString: string;
    if (typeof atob === 'function') {
      jsonString = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } else if (typeof Buffer !== 'undefined') {
      jsonString = Buffer.from(base64, 'base64').toString('utf-8');
    } else {
      return null;
    }

    return JSON.parse(jsonString) as DecodedToken;
  } catch {
    return null;
  }
}
