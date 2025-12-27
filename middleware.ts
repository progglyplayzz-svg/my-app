import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - static files
     * - public files
     * - Next.js internals
     */
    '/((?!_next|favicon.ico|.*\\..*).*)',
  ],
};
