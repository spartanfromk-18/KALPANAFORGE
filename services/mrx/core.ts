/**
 * MR. X CORE SECURITY ENGINE v3.0
 * High-performance threat detection and sanitization
 * Consolidated as per professional standards
 */

export interface ThreatScanResult {
    isThreat: boolean;
    threats: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    blockedPatterns: string[];
}

export interface SanitizeOptions {
    mode: 'standard' | 'supreme';
    allowHtml?: boolean;
    maxLength?: number;
}

const THREAT_PATTERNS = {
    xss: [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=\s*["']?[^"'>]*/gi,
        /<iframe\b/gi,
        /<object\b/gi,
        /<embed\b/gi,
        /<applet\b/gi,
        /vbscript:/gi,
        /data:text\/html/gi,
        /<link\b[^>]*href\s*=\s*["']?javascript:/gi,
        /<img\b[^>]*src\s*=\s*["']?javascript:/gi,
        /<svg\b[^>]*onload/gi,
        /\beval\s*\(/gi,
        /expression\s*\(/gi,
        /<meta\b[^>]*http-equiv/gi,
        /setTimeout\s*\(\s*['"]/gi,
        /setInterval\s*\(\s*['"]/gi,
        /document\.(cookie|location|write)/gi,
        /window\.(location|open)/gi,
    ],
    sqlInjection: [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b.*\b(FROM|INTO|WHERE|TABLE|DATABASE)\b)/gi,
        /UNION\s+SELECT/gi,
        /--\s*$/gm,
        /;\s*(DROP|DELETE|UPDATE|INSERT)/gi,
        /'\s*OR\s*'1'\s*=\s*'1/gi,
        /'\s*OR\s*1\s*=\s*1/gi,
        /\bxp_cmdshell\b/gi,
        /\/\*.*\*\//g,
    ],
    commandInjection: [
        /[;&|`$(){}[\]]/g,
        /\$\(.*\)/g,
        /`.*`/g,
        /\|\|/g,
        /&&/g,
        /\n\s*(rm|cat|ls|wget|curl|chmod|chown|sudo)/gi,
    ],
    pathTraversal: [
        /\.\.[\/\\]/g,
        /\.\.%2[fF]/g,
        /\.\.%5[cC]/g,
        /%2e%2e[\/\\]/gi,
    ],
    ldapInjection: [
        /[*()\\|\&]/g,
        /\x00/g,
    ],
    noSqlInjection: [
        /\$where/gi,
        /\$ne/gi,
        /\$gt/gi,
        /\$lt/gi,
        /\$regex/gi,
        /\$or/gi,
    ],
    prototypePollution: [
        /__proto__/gi,
        /constructor\s*\[/gi,
        /prototype\s*\[/gi,
    ],
    templateInjection: [
        /\{\{.*\}\}/g,
        /\$\{.*\}/g,
        /<%.+%>/g,
    ],
    ssrf: [
        /localhost/gi,
        /127\.0\.0\.1/g,
        /0\.0\.0\.0/g,
        /\[::\]/g,
        /metadata\.google/gi,
        /169\.254\.169\.254/g,
    ],
};

export function scanForThreats(payload: any): ThreatScanResult {
    try {
        const threats: string[] = [];
        const blockedPatterns: string[] = [];
        let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

        const scanText = typeof payload === 'string' ? payload : JSON.stringify(payload);

        const scanCategory = (patterns: RegExp[], category: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
            for (const pattern of patterns) {
                pattern.lastIndex = 0;
                if (pattern.test(scanText)) {
                    threats.push(category);
                    blockedPatterns.push(pattern.source);
                    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
                    if (severityLevels[severity] > severityLevels[maxSeverity]) {
                        maxSeverity = severity;
                    }
                    break;
                }
            }
        };

        scanCategory(THREAT_PATTERNS.xss, 'XSS Attack', 'critical');
        scanCategory(THREAT_PATTERNS.sqlInjection, 'SQL Injection', 'critical');
        scanCategory(THREAT_PATTERNS.commandInjection, 'Command Injection', 'critical');
        scanCategory(THREAT_PATTERNS.pathTraversal, 'Path Traversal', 'high');
        scanCategory(THREAT_PATTERNS.noSqlInjection, 'NoSQL Injection', 'high');
        scanCategory(THREAT_PATTERNS.prototypePollution, 'Prototype Pollution', 'high');
        scanCategory(THREAT_PATTERNS.templateInjection, 'Template Injection', 'high');
        scanCategory(THREAT_PATTERNS.ssrf, 'SSRF Attack', 'high');
        scanCategory(THREAT_PATTERNS.ldapInjection, 'LDAP Injection', 'medium');

        return {
            isThreat: threats.length > 0,
            threats: [...new Set(threats)],
            severity: threats.length > 0 ? maxSeverity : 'low',
            blockedPatterns,
        };
    } catch (e) {
        // FAIL CLOSED: If scanning fails, treat as a critical threat
        return {
            isThreat: true,
            threats: ['Scanner Error'],
            severity: 'critical',
            blockedPatterns: [],
        };
    }
}

export function sanitize(input: string, options: SanitizeOptions = { mode: 'standard' }): string {
    if (typeof input !== 'string') return '';
    let sanitized = input;
    if (options.maxLength && sanitized.length > options.maxLength) {
        sanitized = sanitized.substring(0, options.maxLength);
    }

    if (options.mode === 'supreme') {
        if (!options.allowHtml) sanitized = sanitized.replace(/<[^>]*>/g, '');
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/javascript:/gi, '').replace(/data:text\/html/gi, '').replace(/vbscript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
        sanitized = sanitized.replace(/;\s*(DROP|DELETE|UPDATE|INSERT|EXEC)/gi, '').replace(/UNION\s+SELECT/gi, '');
        sanitized = sanitized.replace(/[`$]/g, '').replace(/\|\|/g, '').replace(/&&/g, '');
        sanitized = sanitized.replace(/\.\.[\/\\]/g, '').replace(/\x00/g, '');
        sanitized = sanitized.replace(/__proto__/gi, '').replace(/constructor\[/gi, '').replace(/prototype\[/gi, '');
        sanitized = sanitized.replace(/\{\{.*\}\}/g, '').replace(/\$\{.*\}/g, '');
        sanitized = sanitized.replace(/metadata\.google/gi, '').replace(/169\.254\.169\.254/g, '');
    } else {
        sanitized = sanitized.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
        sanitized = sanitized.replace(/\x00/g, '');
    }
    return sanitized.trim();
}

export function sanitizeObject(obj: any, options: SanitizeOptions = { mode: 'standard' }): any {
    if (typeof obj === 'string') return sanitize(obj, options);
    if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item, options));
    if (obj && typeof obj === 'object') {
        const sanitizedObj: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const sanitizedKey = sanitize(key, options);
                sanitizedObj[sanitizedKey] = sanitizeObject(obj[key], options);
            }
        }
        return sanitizedObj;
    }
    return obj;
}

export function quickThreatCheck(input: string): boolean {
    if (!input) return false;
    const lowerInput = input.toLowerCase();
    const quickPatterns = ['<script', 'javascript:', 'onerror=', 'onload=', 'onclick=', 'data:text/html', 'eval(', 'document.cookie', 'document.location', 'window.location', '__proto__', 'constructor[', 'union select', 'drop table', 'insert into', '../', '..\\'];
    return quickPatterns.some(pattern => lowerInput.includes(pattern));
}
