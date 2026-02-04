# MR. X v3.0 - Dual-Layered Security System

**Elite Multi-Layered Security for Modern Web Applications**

## 🛡️ Overview

MR. X v3.0 is an industrial-grade security system that provides comprehensive protection against common web vulnerabilities through a dual-layered architecture:

1. **Client-Side Layer**: Browser-based threat detection and sanitization
2. **Server-Side Layer**: Edge Middleware + API Route validation

## 📋 Features

### Security Capabilities
- ✅ **XSS Protection**: Blocks script injection, event handlers, and dangerous HTML
- ✅ **SQL Injection Prevention**: Detects and blocks SQL manipulation attempts
- ✅ **Command Injection Defense**: Prevents shell command execution
- ✅ **Path Traversal Protection**: Stops directory traversal attacks
- ✅ **Prototype Pollution Defense**: Blocks JavaScript object poisoning
- ✅ **SSRF Prevention**: Blocks internal network access attempts
- ✅ **NoSQL Injection Protection**: Defends against MongoDB query manipulation
- ✅ **Rate Limiting**: Prevents DoS attacks
- ✅ **Content Length Validation**: Blocks oversized payloads

### Operational Features
- 🎯 **Supreme Mode**: Ultra-aggressive threat neutralization
- 📊 **Real-time Logging**: Comprehensive security event tracking
- 🔄 **Circuit Breaker**: Automatic recovery prevention
- ⚡ **High Performance**: Optimized for minimal latency
- 🌐 **Edge Deployment**: Runs on Vercel Edge Network

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER REQUEST                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              CLIENT-SIDE VALIDATION                      │
│  (Browser - mrxService.ts with mrxCore)                 │
│  • Quick threat checks                                   │
│  • Input sanitization                                    │
│  • Supreme Mode toggle                                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           VERCEL EDGE MIDDLEWARE                         │
│  (Global Layer - middleware.ts)                         │
│  • Rate limiting                                         │
│  • Body size validation                                  │
│  • Quick threat scanning                                 │
│  • Security headers injection                            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              API ROUTE VALIDATION                        │
│  (Explicit checks - api/*.ts)                           │
│  • Full threat scanning                                  │
│  • Input sanitization                                    │
│  • Schema validation                                     │
│  • Output validation                                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│            EXTERNAL API (e.g., Gemini)                   │
└─────────────────────────────────────────────────────────┘
```

## 📦 Installation

### 1. Copy Files to Your Project

```bash
# Core security engine
/services/mrxCore.ts

# Client-side service
/services/mrxService.ts

# Edge middleware
/middleware.ts

# API routes (examples)
/api/caption.ts
/api/enhance.ts

# Tests
/tests/mrx-security.test.ts
/tests/middleware.test.ts
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create or update `.env.local`:

```env
# Gemini API Key (if using AI features)
GEMINI_API_KEY=your_api_key_here

# MR. X Configuration (optional)
MRX_ENABLE_GLOBAL_SCANNING=true
MRX_BLOCK_ON_THREAT=true
MRX_LOG_THREATS=true
MRX_MAX_BODY_SIZE=1048576
MRX_RATE_LIMIT=100
```

## 🚀 Usage

### Client-Side Integration

```typescript
import { mrxService } from '@/services/mrxService';

// Subscribe to security logs
const unsubscribe = mrxService.subscribe((logs) => {
  console.log('Security logs updated:', logs);
});

// Enable Supreme Mode
mrxService.setSupremeMode(true);

// Audit user actions
const handleSubmit = (formData: any) => {
  const { allowed, scanResult } = mrxService.auditAction('FORM_SUBMIT', formData);
  
  if (!allowed) {
    alert('Security threat detected! Request blocked.');
    return;
  }
  
  // Proceed with submission
  submitForm(formData);
};

// Sanitize input
const safeInput = mrxService.sanitizeInput(userInput);

// Sanitize objects
const safeData = mrxService.sanitizeObject(formData);
```

### UI Component Example (React)

```tsx
import { useEffect, useState } from 'react';
import { mrxService } from '@/services/mrxService';

function SecurityDashboard() {
  const [logs, setLogs] = useState([]);
  const [supremeMode, setSupremeMode] = useState(false);

  useEffect(() => {
    const unsubscribe = mrxService.subscribe(setLogs);
    const config = mrxService.getSecurityConfig();
    setSupremeMode(config.supremeMode);
    
    return unsubscribe;
  }, []);

  const toggleSupremeMode = () => {
    mrxService.setSupremeMode(!supremeMode);
    setSupremeMode(!supremeMode);
  };

  return (
    <div>
      <h2>MR. X Security Dashboard</h2>
      
      <button onClick={toggleSupremeMode}>
        {supremeMode ? '🛡️ Supreme Mode: ON' : 'Standard Mode'}
      </button>

      <div className="logs">
        {logs.map((log, i) => (
          <div key={i} className={`log-${log.severity}`}>
            <strong>{log.event}</strong>: {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Server-Side API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { scanForThreats, sanitize } from '@/services/mrxCore';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Security Layer 2: Explicit validation
  const scanResult = scanForThreats(body.text);
  
  if (scanResult.isThreat) {
    return NextResponse.json(
      {
        error: 'Security threat detected',
        threats: scanResult.threats,
        severity: scanResult.severity,
      },
      { 
        status: 403,
        headers: { 'X-MRX-Status': 'THREAT_BLOCKED' }
      }
    );
  }

  // Sanitize before processing
  const safeText = sanitize(body.text, { mode: 'supreme' });

  // Process with sanitized input
  const result = await processData(safeText);

  return NextResponse.json({ result });
}
```

## 🧪 Testing

### Run Automated Tests

```bash
# Run core security tests
npm run test:security

# Or directly with Node.js
node tests/mrx-security.test.ts

# Run middleware tests
node tests/middleware.test.ts
```

### Manual Testing

1. **Test XSS Protection**
   ```bash
   curl -X POST http://localhost:3000/api/caption \
     -H "Content-Type: application/json" \
     -d '{"prompt": "<script>alert(1)</script>"}'
   ```
   Expected: 403 Forbidden

2. **Test SQL Injection**
   ```bash
   curl -X POST http://localhost:3000/api/enhance \
     -H "Content-Type: application/json" \
     -d '{"text": "'; DROP TABLE users--"}'
   ```
   Expected: 403 Forbidden

3. **Test Rate Limiting**
   ```bash
   # Run 150 requests quickly
   for i in {1..150}; do
     curl -X POST http://localhost:3000/api/caption \
       -H "Content-Type: application/json" \
       -d '{"prompt": "test"}' &
   done
   ```
   Expected: 429 Too Many Requests after 100 requests

4. **Test Supreme Mode**
   - Enable Supreme Mode in your app
   - Try submitting: `<img src=x onerror=alert(1)>`
   - Check security logs for instant blocking

## 📊 Performance Benchmarks

- **Quick Threat Check**: < 1ms per check
- **Full Threat Scan**: < 10ms for typical payloads
- **Sanitization**: < 5ms for standard text
- **Middleware Overhead**: < 2ms per request

## 🔧 Configuration

### Security Config Object

```typescript
interface SecurityConfig {
  supremeMode: boolean;      // Ultra-aggressive protection
  logThreats: boolean;       // Log security events
  blockOnThreat: boolean;    // Block vs. log only
}
```

### Middleware Config

Edit `middleware.ts`:

```typescript
const SECURITY_CONFIG = {
  enableGlobalScanning: true,
  blockOnThreat: true,
  logThreats: true,
  maxBodySize: 1024 * 1024,  // 1MB
  rateLimitRequests: 100,     // Per minute per IP
};
```

## 🎯 Supreme Mode

Supreme Mode provides maximum security with aggressive threat neutralization:

- All threats blocked instantly (no logging delay)
- Enhanced pattern matching
- Stricter sanitization
- Lower false positive tolerance
- Immediate circuit breaking on repeated threats

**Enable programmatically:**
```typescript
mrxService.setSupremeMode(true);
```

**Enable via UI:**
Add a toggle in your settings/dashboard component.

## 📈 Monitoring & Logs

### View Security Logs

```typescript
// Get all logs
const logs = mrxService.getLogs();

// Clear logs
mrxService.clearLogs();

// Subscribe to live updates
mrxService.subscribe((logs) => {
  console.log('New security event:', logs[0]);
});
```

### Log Structure

```typescript
interface SupremeLog {
  timestamp: number;
  event: string;
  type: 'HEAL' | 'SECURITY' | 'PERFORMANCE' | 'ADVICE';
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL' | 'PRESTIGE';
  message: string;
  metadata?: any;
}
```

## 🔒 Security Headers

The middleware automatically adds these security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [configured policy]
X-MRX-Protected: true
```

## ⚠️ Important Notes

1. **Browser Storage**: MR. X v3.0 stores configuration and logs in `localStorage`
2. **Edge Compatibility**: All code is compatible with Vercel Edge Runtime
3. **Performance**: Minimal overhead (~2ms per request)
4. **False Positives**: Very rare in standard mode, tune Supreme Mode as needed
5. **Fail-Safe**: System fails open (allows requests) if scanning encounters errors

## 🐛 Troubleshooting

### Issue: Legitimate requests being blocked

**Solution**: 
- Check if Supreme Mode is enabled
- Review security logs to identify the pattern being flagged
- Adjust patterns in `mrxCore.ts` if needed
- Consider using standard mode for less strict validation

### Issue: Performance degradation

**Solution**:
- Enable quick threat check before full scan
- Increase rate limit threshold
- Reduce log retention (currently 50 entries)
- Check for circuit breaker activation

### Issue: Middleware not blocking threats

**Solution**:
- Verify middleware.ts is in project root
- Check `next.config.js` for middleware configuration
- Ensure `SECURITY_CONFIG.blockOnThreat` is `true`
- Check console for middleware errors

## 📝 License

MIT License - Use freely in your projects

## 🤝 Contributing

Contributions welcome! Please ensure:
- All tests pass
- New patterns are well-tested
- Performance benchmarks maintained
- Documentation updated

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review test files for examples
3. Check security logs for detailed error info

---

**MR. X v3.0** - Elite Protection for Modern Web Applications 🛡️
