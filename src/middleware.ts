import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Proteção da área administrativa (/admin)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionToken = request.cookies.get('wisdom_admin_session')?.value;

    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
