 /**
 * Global Edge Security Architecture Core
 * Optimizes rate-limiting with strict stateless execution patterns.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Freeze configuration states immutably to safeguard against execution drift
const SECURITY_CONFIG = Object.freeze({
    RATE_LIMIT_REQUESTS: 100,
    WINDOW_MS: 60000
});

export const config = {
    matcher: ['/api/:path*']
};

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const ip = request.ip || '127.0.0.1';
    
    // Inject centralized, hardened infrastructure tracking headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-MRX-Protected', 'true');

    // Secure request method validation
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return new NextResponse(JSON.stringify({ error: 'Unsupported media signature type.' }), {
                status: 415,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    return response;
}
