 /**
 * Global Edge Security Gateway Architecture
 * Enforces atomic state validation via Upstash Distributed KV infrastructure.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Initialize the production Redis-backed rate limiter
const ratelimiter = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(100, '60 s'),
    analytics: true,
    prefix: '@clforge/edge-mrx'
});

export const config = {
    matcher: ['/api/:path*']
};

export async function middleware(request: NextRequest) {
    const ip = request.ip || '127.0.0.1';

    // 1. Enforce Atomic Global Edge Rate Limiting
    const { success, limit, reset, remaining } = await ratelimiter.limit(ip);
    
    if (!success) {
        return new NextResponse(
            JSON.stringify({ error: 'Too many requests. Please slow down.' }), 
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString()
                }
            }
        );
    }

    const response = NextResponse.next();

    // 2. Inject Security Hardening Headers (Google Production Standard)
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-MRX-Protected', 'true');

    return response;
}
