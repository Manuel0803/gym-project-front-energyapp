/**
 * Manages authentication cookies so that Edge Middleware can inspect tokens synchronously.
 */

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

/**
 * Persists the JWT in document.cookie for Edge middleware inspection.
 * Sets both `token` and `auth_token` for maximum compatibility.
 *
 * @param token - The raw access JWT.
 */
export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined' || !token) return;

  const isSecure = window.location.protocol === 'https:' ? '; Secure' : '';
  const cookieOptions = `path=/; max-age=${SEVEN_DAYS_SECONDS}; SameSite=Lax${isSecure}`;

  document.cookie = `token=${encodeURIComponent(token)}; ${cookieOptions}`;
  document.cookie = `auth_token=${encodeURIComponent(token)}; ${cookieOptions}`;
}

/**
 * Clears the authentication cookies upon logout.
 */
export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;

  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
}

/**
 * Reads the authentication cookie in the browser environment.
 */
export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/(?:^|;\s*)(?:token|auth_token)=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
