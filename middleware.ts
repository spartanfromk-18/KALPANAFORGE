import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { scanForThreats } from './services/mrx/core';

// Configuration for MR. X Middleware
const SECURITY_CONFIG = {
    enableGlobalScanning: true,
    blockOnThreat: true,
    logThreats: true,
    maxBodySize: 1024 * 1024, // 1MB
    rateLimitRequests: 100,    // Per minute per IP
};

// In-memory rate limiting (per Edge instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowMs = 60000;
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > windowMs) {
        record.count = 1;
        record.lastReset = now;
    } else {
        record.count++;
    }

    rateLimitMap.set(ip, record);
    return record.count > SECURITY_CONFIG.rateLimitRequests;
}

export async function middleware(request: NextRequest) {
    const ip = request.ip || 'anonymous';
    const response = NextResponse.next();

    // 1. Rate Limiting
    if (isRateLimited(ip)) {
        return new NextResponse(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 2. Global Threat Scanning (for POST/PUT requests with bodies)
    if (SECURITY_CONFIG.enableGlobalScanning && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        try {
            // Check content length first
            const contentLength = parseInt(request.headers.get('content-length') || '0');
            if (contentLength > SECURITY_CONFIG.maxBodySize) {
                return new NextResponse(JSON.stringify({ error: 'Payload too large.' }), {
                    status: 413,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Clone request to read body without consuming it
            const clonedReq = request.clone();
            const body = await clonedReq.json();

            const scanResult = scanForThreats(body);
            if (scanResult.isThreat && SECURITY_CONFIG.blockOnThreat) {
                console.warn(`[MR. X MIDDLEWARE] Blocked threat from ${ip}:`, scanResult.threats);
                return new NextResponse(JSON.stringify({
                    error: 'Security threat detected',
                    type: scanResult.threats[0]
                }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json', 'X-MRX-Status': 'BLOCKED' }
                });
            }
        } catch (e) {
            // If body parsing fails (e.g. not JSON), we still allow it to pass to let the API handle it
            // or we could "Fail Closed" here too. Let's be cautious for non-JSON payloads.
        }
    }

    // 3. Inject Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-MRX-Protected', 'true');

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/api/:path*',
};
