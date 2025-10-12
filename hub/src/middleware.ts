import { type NextRequest, NextResponse } from 'next/server';

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';

  if(host === 'hub.l.pjim.au:3000')
  {
    return 'hub'
  }

  if(host === 'talks.l.pjim.au:3000')
  {
    return 'talks'
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/${subdomain}`, request.url));
    }

    return NextResponse.rewrite(new URL(`/${subdomain}${pathname}`, request.url));
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|static|upload|[\\w-]+\\.\\w+).*)'
  ]
};
