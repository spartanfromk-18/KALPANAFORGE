import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { ipAddress, next } from '@vercel/edge';

export const config = { matcher: ['/api/:path*'] };

const securityHeaders = (response: Response): Response => {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-MRX-Protected', 'true');
    return response;
};

export const clientIp = (request: Request): string => {
    if (process.env.VERCEL !== undefined) return ipAddress(request) || 'unknown';
    // Header fallback is only for local development; Vercel requests use ipAddress.
    return ipAddress(request)
        || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
};

export default async function middleware(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return next();

    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (!kvUrl || !kvToken) {
        console.error('[middleware] KV_REST_API_URL and KV_REST_API_TOKEN are required; rate limiting is unavailable');
        return securityHeaders(new Response(JSON.stringify({ error: 'Service temporarily unavailable. Please try again.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        }));
    }

    try {
        const limiter = new Ratelimit({
            redis: kv,
            limiter: Ratelimit.slidingWindow(100, '60 s'),
            analytics: true,
            prefix: '@kalpana-forge/api',
        });
        const result = await limiter.limit(clientIp(request));
        if (!result.success) {
            return securityHeaders(new Response(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
                status: 429,
                headers: { 'Content-Type': 'application/json', 'X-RateLimit-Limit': String(result.limit), 'X-RateLimit-Remaining': String(result.remaining), 'X-RateLimit-Reset': String(result.reset) },
            }));
        }
    } catch (error) {
        console.error('[middleware] KV rate-limit failure; request rejected', error);
        return securityHeaders(new Response(JSON.stringify({ error: 'Service temporarily unavailable. Please try again.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        }));
    }
    return next();
}