import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from '@/common/utils/jwt.utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || request.nextUrl.host || '';
  const hostname = host.split(':')[0].toLowerCase();

  // 1. Hostname and Subdomain detection (CHGYM2-18)
  // Distinguishes "admin.energyapp.com" (global SaaS admin) vs client gym subdomain
  const isSuperAdminHost =
    hostname === 'admin.energyapp.com' || hostname.startsWith('admin.');

  let subdomain = '';
  const hostParts = hostname.split('.');
  if (
    hostname.endsWith('.vercel.app') ||
    hostname.endsWith('.onrender.com') ||
    hostname.endsWith('.netlify.app')
  ) {
    subdomain = '';
  } else if (hostParts.length > 2) {
    // e.g. "energy.energyapp.com" -> "energy"
    subdomain = hostParts[0];
  } else if (hostParts.length === 2 && hostParts[1] === 'localhost') {
    // e.g. "energy.localhost" -> "energy"
    subdomain = hostParts[0];
  }

  // Pass tenant context headers for downstream use in server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hostname', hostname);
  requestHeaders.set('x-subdomain', subdomain);
  requestHeaders.set('x-is-super-admin-host', isSuperAdminHost ? '1' : '0');

  // 2. Read and decode JWT from cookies at Edge
  const token =
    request.cookies.get('token')?.value ||
    request.cookies.get('auth_token')?.value;

  const decoded = decodeJwt(token);
  const isExpired = decoded?.exp ? decoded.exp * 1000 < Date.now() : false;
  const isAuthenticated = Boolean(token && decoded && !isExpired);

  const role = (decoded?.role || '').toString().toUpperCase();
  const isTrainer = role === 'TRAINER' || role === 'PROFESSOR' || role === 'PROFESOR';
  const requiresOnboarding = Boolean(decoded?.requiresOnboarding);

  // Route classifications
  const isAuthRoute =
    pathname === '/login' || pathname.startsWith('/recuperar-contrasenia');

  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isCustomerRoute = pathname.startsWith('/alumno');
  const isAdminRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/dashboard');
  const isProfesorRoute = pathname.startsWith('/profesor');
  const isSuperAdminRoute = pathname.startsWith('/super-admin');

  const isProtectedRoute =
    isCustomerRoute ||
    isAdminRoute ||
    isProfesorRoute ||
    isSuperAdminRoute ||
    isOnboardingRoute;

  // 3. Unauthenticated access enforcement
  if (!isAuthenticated) {
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 4. Authenticated users attempting to access /login
  if (isAuthRoute) {
    if (requiresOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/alumno', request.url));
    }
    if (role === 'SUPER_ADMIN') {
      return NextResponse.redirect(
        new URL('/super-admin/gimnasios', request.url)
      );
    }
    if (isTrainer) {
      return NextResponse.redirect(new URL('/profesor', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. Regla de Onboarding Forzoso (CHGYM2-18):
  // Si el JWT decodificado contiene requiresOnboarding: true, cualquier intento
  // de acceder a /alumno, /admin o /profesor (y /dashboard) debe ser redirigido forzosamente a /onboarding.
  if (requiresOnboarding) {
    const isRestrictedDuringOnboarding =
      isCustomerRoute || isAdminRoute || isProfesorRoute;

    if (isRestrictedDuringOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    if (isOnboardingRoute) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
  } else {
    // If user already completed onboarding, do not allow staying on /onboarding
    if (isOnboardingRoute) {
      const destination = role === 'CUSTOMER' ? '/alumno' : '/dashboard';
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // 6. Protección por Rol (CHGYM2-18):
  // Un usuario con rol CUSTOMER que intente acceder a rutas de /admin o /profesor (o /dashboard)
  // debe ser redirigido a /alumno.
  if (role === 'CUSTOMER') {
    if (isAdminRoute || isProfesorRoute) {
      return NextResponse.redirect(new URL('/alumno', request.url));
    }
  }

  // Trainer route protection
  if (isTrainer) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/profesor', request.url));
    }
  }

  // Super Admin route protection
  if (isSuperAdminRoute && role !== 'SUPER_ADMIN') {
    const fallback = role === 'CUSTOMER' ? '/alumno' : '/dashboard';
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  // Root redirect for authenticated users
  if (pathname === '/') {
    if (requiresOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/alumno', request.url));
    }
    if (role === 'SUPER_ADMIN') {
      return NextResponse.redirect(
        new URL('/super-admin/gimnasios', request.url)
      );
    }
    if (isTrainer) {
      return NextResponse.redirect(new URL('/profesor', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, and static assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};
