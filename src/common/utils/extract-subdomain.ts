/**
 * Extracts the tenant subdomain from the current window location or provided hostname.
 *
 * @param customHostname - Optional hostname to parse (e.g. from request headers in server components).
 * @returns The subdomain string or fallback default domain.
 */
export const getSubdomain = (customHostname?: string): string => {
  let hostname = customHostname;

  if (!hostname && typeof window !== 'undefined') {
    hostname = window.location.hostname;
  }

  if (hostname) {
    // Strip port if present
    const cleanHost = hostname.split(':')[0].toLowerCase();

    // Ignore hosting providers and local development
    if (
      cleanHost === 'localhost' ||
      cleanHost.endsWith('.vercel.app') ||
      cleanHost.endsWith('.onrender.com') ||
      cleanHost.endsWith('.netlify.app')
    ) {
      return '';
    }

    const parts = cleanHost.split('.');

    // Handle "subdomain.energyapp.com", "admin.energyapp.com"
    if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      return parts[0];
    }
  }

  return '';
};

/**
 * Checks whether the hostname corresponds to the global SaaS Super Admin domain (admin.energyapp.com).
 *
 * @param customHostname - Optional hostname to evaluate.
 * @returns True if the host is the super admin portal.
 */
export const isSuperAdminDomain = (customHostname?: string): boolean => {
  let hostname = customHostname;

  if (!hostname && typeof window !== 'undefined') {
    hostname = window.location.hostname;
  }

  if (!hostname) return false;

  const cleanHost = hostname.split(':')[0].toLowerCase();
  return cleanHost === 'admin.energyapp.com' || cleanHost.startsWith('admin.');
};
