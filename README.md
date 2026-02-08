# MR. X v3.0 - Triple-Layered Security System

**Professional Security Framework for Modern Web Applications**

## 🛡️ Overview

MR. X v3.0 is an industrial-grade security system that provides comprehensive protection against common web vulnerabilities through a defense-in-depth architecture:

1. **Global Layer (Edge)**: Vercel Edge Middleware with rate limiting and global threat scanning.
2. **Resource Layer (API)**: Explicit server-side validation within critical API routes.
3. **Application Layer (Client)**: Browser-based auditing and input sanitization.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER REQUEST                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 1: EDGE MIDDLEWARE (Global)              │
│  (middleware.ts)                                        │
│  • Rate limiting (IP-based)                              │
│  • Global body scanning                                  │
│  • Security headers injection                            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 2: API VALIDATION (Resource)             │
│  (api/*.ts)                                             │
│  • Redundant threat scanning                             │
│  • Schema & Content-Length validation                    │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 3: CLIENT AUDITING (App)                 │
│  (services/mrx/service.ts)                              │
│  • Input sanitization                                    │
│  • Security event logging                                │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                       │
└─────────────────────────────────────────────────────────┘
```

## 📋 Features

### Security Capabilities
- ✅ **XSS Protection**: Comprehensive script injection and event handler blocking.
- ✅ **SQL/NoSQL Injection Prevention**: Advanced detection for database manipulation attempts.
- ✅ **Injection Defense**: Protection against Command and Template injection.
- ✅ **Path Traversal Protection**: Prevents unauthorized directory access.
- ✅ **Prototype Pollution Defense**: Blocks malicious object manipulation.
- ✅ **Rate Limiting**: Integrated protections against DoS attacks.

### Operational Features
- 🛡️ **Supreme Mode**: Aggressive threat neutralization protocols.
- 📊 **Real-time Monitoring**: Integrated security event tracking.
- 🔄 **Circuit Breaker**: Automatic failover and protection management.
- ⚡ **High Efficiency**: Optimized for sub-millisecond overhead.

## 📦 Installation & Setup

1. **Configure Environment Variables**:
   Update `.env.local` with your security configuration:
   ```env
   MRX_ENABLE_GLOBAL_SCANNING=true
   MRX_BLOCK_ON_THREAT=true
   MRX_MAX_BODY_SIZE=1048576
   ```

2. **Integration**:
   The system is automatically integrated via `middleware.ts` for all `/api` routes. Secondary validation should be called within individual API handlers for defense-in-depth.

## 🚀 Usage

### Server-Side Validation
```typescript
import { scanForThreats } from '@/services/mrx/core';

export async function POST(req: Request) {
  const body = await req.json();
  const { isThreat, threats } = scanForThreats(body);
  
  if (isThreat) {
    return new Response(JSON.stringify({ error: 'Blocked' }), { status: 403 });
  }
}
```

### Client-Side Sanitization
```typescript
import { mrxService } from '@/services/mrx/service';

const safeInput = mrxService.sanitizeInput(userInput);
```

## 🧪 Testing

Automated security tests are integrated into the development workflow. To run the full security suite:
```bash
npm run test:security
```
This will execute exhaustive pattern matching tests against a variety of known threat vectors.

## 🔒 Security Headers

The system automatically manages critical security headers including:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy` (configurable)
- `Strict-Transport-Security`

## ⚠️ Important Notes

1. **Fail-Closed Policy**: For maximum security, the system is configured to block requests if a scanning error occurs.
2. **Edge Compatibility**: All security components are compatible with Vercel Edge Runtime.
3. **Audit Logs**: Activity is logged locally for developer review.

---

**MR. X v3.0** - Fortifying Digital Experiences 🛡️
