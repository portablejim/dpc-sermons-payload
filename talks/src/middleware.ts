import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
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
