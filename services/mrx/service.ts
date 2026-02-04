/**
 * SUPREME INTELLIGENCE: MR. X v3.0 - CONSOLIDATED EDITION
 * The Elite Digital Guardian & Silent Creator
 */

import { scanForThreats, sanitize, sanitizeObject, quickThreatCheck, type ThreatScanResult } from './core';

export interface SupremeLog {
    timestamp: number;
    event: string;
    type: 'HEAL' | 'SECURITY' | 'PERFORMANCE' | 'ADVICE';
    severity: 'LOW' | 'MEDIUM' | 'CRITICAL' | 'PRESTIGE';
    message: string;
    metadata?: any;
}

export interface SecurityConfig {
    supremeMode: boolean;
    logThreats: boolean;
    blockOnThreat: boolean;
}

const MRX_STORAGE_KEY = 'mrx_supreme_intelligence_v3';
const MRX_CONFIG_KEY = 'mrx_security_config';

const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_WINDOW_MS = 60000;
let circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
let recoveryAttempts: number[] = [];
let circuitOpenedAt: number | null = null;

let subscribers: ((logs: SupremeLog[]) => void)[] = [];
let supremeLogs: SupremeLog[] = [];
let perfWindow: number[] = [];

let securityConfig: SecurityConfig = {
    supremeMode: false,
    logThreats: true,
    blockOnThreat: true,
};

// Load security config
if (typeof window !== 'undefined') {
    try {
        const savedConfig = localStorage.getItem(MRX_CONFIG_KEY);
        if (savedConfig) {
            securityConfig = { ...securityConfig, ...JSON.parse(savedConfig) };
        }
    } catch (e) {
        console.error('[MR. X SUPREME] Failed to load config', e);
    }
}

export const mrxService = {
    subscribe: (callback: (logs: SupremeLog[]) => void) => {
        subscribers.push(callback);
        callback([...supremeLogs]);
        return () => { subscribers = subscribers.filter(s => s !== callback); };
    },

    notify: () => {
        subscribers.forEach(s => s([...supremeLogs]));
    },

    getSecurityConfig: (): SecurityConfig => ({ ...securityConfig }),

    setSupremeMode: (enabled: boolean) => {
        securityConfig.supremeMode = enabled;
        mrxService.saveSecurityConfig();

        mrxService.saveLog({
            timestamp: Date.now(),
            event: 'SUPREME_MODE_TOGGLED',
            type: 'SECURITY',
            severity: enabled ? 'PRESTIGE' : 'LOW',
            message: enabled
                ? '🛡️ SUPREME MODE ACTIVATED: Maximum security protocols engaged.'
                : 'Supreme Mode deactivated. Standard security protocols active.',
        });
    },

    saveSecurityConfig: () => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(MRX_CONFIG_KEY, JSON.stringify(securityConfig));
            } catch (e) {
                console.error('[MR. X SUPREME] Failed to save config', e);
            }
        }
    },

    checkCircuitBreaker: (): boolean => {
        const now = Date.now();
        recoveryAttempts = recoveryAttempts.filter(t => now - t < CIRCUIT_BREAKER_WINDOW_MS);

        if (circuitBreakerState === 'OPEN' && circuitOpenedAt) {
            if (now - circuitOpenedAt > CIRCUIT_BREAKER_WINDOW_MS) {
                circuitBreakerState = 'HALF_OPEN';
            }
        }

        if (circuitBreakerState === 'OPEN') return false;

        recoveryAttempts.push(now);

        if (recoveryAttempts.length >= CIRCUIT_BREAKER_THRESHOLD) {
            circuitBreakerState = 'OPEN';
            circuitOpenedAt = now;
            return false;
        }

        if (circuitBreakerState === 'HALF_OPEN') {
            circuitBreakerState = 'CLOSED';
            recoveryAttempts = [];
        }

        return true;
    },

    diagnoseAndRecover: (error: Error, errorInfo?: any) => {
        if (!mrxService.checkCircuitBreaker()) {
            mrxService.saveLog({
                timestamp: Date.now(),
                event: 'RECOVERY_BLOCKED',
                type: 'SECURITY',
                severity: 'CRITICAL',
                message: 'Circuit breaker OPEN - recovery blocked. Please refresh manually.',
                metadata: { error: error.message }
            });
            return { action: 'CIRCUIT_OPEN', message: 'System protection active.' };
        }

        const severity = mrxService.calculateSeverity(error);
        mrxService.saveLog({
            timestamp: Date.now(),
            event: 'CRASH_NEUTRALIZED',
            type: 'HEAL',
            severity,
            message: `Supreme Intelligence neutralized a ${severity} failure: ${error.message}`,
            metadata: { stack: errorInfo?.componentStack }
        });

        return mrxService.executeSupremeRecovery(error, severity);
    },

    calculateSeverity: (error: Error): 'LOW' | 'MEDIUM' | 'CRITICAL' => {
        const msg = error.message.toLowerCase();
        if (msg.includes('canvas') || msg.includes('webgl') || msg.includes('null')) return 'CRITICAL';
        return 'MEDIUM';
    },

    executeSupremeRecovery: (error: Error, severity: string) => {
        if (severity === 'CRITICAL') return { action: 'WIPE_AND_RESET', message: 'Executing Deep State Rollback.' };
        if (error.message.includes('layer')) return { action: 'REPAIR_LAYERS', message: 'Repairing corrupted layers.' };
        return { action: 'DYNAMIC_REFRESH', message: 'Synchronizing environment.' };
    },

    auditAction: (action: string, payload: any): { allowed: boolean; scanResult?: ThreatScanResult } => {
        const quickCheck = typeof payload === 'string' && quickThreatCheck(payload);

        if (quickCheck && securityConfig.supremeMode) {
            mrxService.saveLog({
                timestamp: Date.now(),
                event: 'SECURITY_THREAT_NEUTRALIZED',
                type: 'SECURITY',
                severity: 'CRITICAL',
                message: `⚠️ SUPREME MODE: Malicious pattern detected in [${action}]. BLOCKED.`,
                metadata: { action, threatType: 'Quick Scan' }
            });
            return { allowed: false };
        }

        const scanResult = scanForThreats(payload);

        if (scanResult.isThreat) {
            mrxService.saveLog({
                timestamp: Date.now(),
                event: 'SECURITY_THREAT_NEUTRALIZED',
                type: 'SECURITY',
                severity: scanResult.severity.toUpperCase() as any,
                message: `🛡️ ${securityConfig.supremeMode ? 'SUPREME MODE' : 'Standard'}: ${scanResult.threats.join(', ')} detected in [${action}]. ${securityConfig.blockOnThreat ? 'BLOCKED' : 'LOGGED'}.`,
                metadata: { action, threats: scanResult.threats }
            });

            if (securityConfig.blockOnThreat) return { allowed: false, scanResult };
        }

        return { allowed: true, scanResult };
    },

    sanitizeInput: (input: string): string => sanitize(input, {
        mode: securityConfig.supremeMode ? 'supreme' : 'standard',
        maxLength: 10000,
    }),

    sanitizeObject: (obj: any): any => sanitizeObject(obj, {
        mode: securityConfig.supremeMode ? 'supreme' : 'standard',
        maxLength: 10000,
    }),

    recordFrame: (timestamp: number) => {
        perfWindow.push(timestamp);
        if (perfWindow.length > 60) perfWindow.shift();
        if (perfWindow.length === 60) {
            const fps = 60000 / (perfWindow[59] - perfWindow[0]);
            if (fps < 30) mrxService.optimize('LOW_FPS');
        }
    },

    optimize: (reason: string) => {
        if (reason === 'LOW_FPS') {
            mrxService.saveLog({
                timestamp: Date.now(),
                event: 'PERFORMANCE_FORGED',
                type: 'PERFORMANCE',
                severity: 'LOW',
                message: 'FPS drop detected. Disabling background effects for fluidity.'
            });
        }
    },

    applyMedication: () => {
        mrxService.saveLog({
            timestamp: Date.now(),
            event: 'COGNITIVE_OVERHAUL',
            type: 'HEAL',
            severity: 'PRESTIGE',
            message: 'Mr. X has ingested "Supreme Medication". Cognitive refresh initiated.'
        });

        return {
            message: "MEDICATION APPLIED: Creative fluidness increased. Your genius is unrestricted.",
            boostType: 'PRESTIGE_REFRESH'
        };
    },

    saveLog: (log: SupremeLog) => {
        try {
            supremeLogs.unshift(log);
            mrxService.notify();
            if (typeof window !== 'undefined') {
                const logs = JSON.parse(localStorage.getItem(MRX_STORAGE_KEY) || '[]');
                logs.unshift(log);
                localStorage.setItem(MRX_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
            }
        } catch (e) {
            console.error('[MR. X SUPREME] Log failure', e);
        }
    },

    getLogs: (): SupremeLog[] => [...supremeLogs],

    getEliteAdvice: (layers: any[], canvasWidth: number, canvasHeight: number): string | null => {
        if (!layers || layers.length === 0) return null;
        const suggestions: string[] = [];

        layers.forEach((layer: any) => {
            if (layer.hidden) return;
            const textColor = layer.color?.toLowerCase() || '#ffffff';
            const isLightText = textColor.includes('fff') || textColor === 'white';
            const isDarkText = textColor.includes('000') || textColor === 'black';

            if (isLightText && layer.y < canvasHeight * 0.2) suggestions.push("Add a dark gradient overlay behind top text for readability.");
            if (isDarkText && layer.y > canvasHeight * 0.8) suggestions.push("Dark text near bottom may get lost. Try white with drop shadow.");
            if (layer.x < 30 || layer.x > canvasWidth - 50) suggestions.push("Some text is too close to the edge. Add padding.");
        });

        const fonts = new Set(layers.filter((l: any) => !l.hidden).map((l: any) => l.fontFamily));
        if (fonts.size > 3) suggestions.push(`Using ${fonts.size} fonts. stick to 2-3 for elite design.`);

        if (suggestions.length === 0) return null;

        if (typeof window !== 'undefined') {
            const lastAdviceTime = parseInt(localStorage.getItem('mrx_last_advice') || '0');
            if (Date.now() - lastAdviceTime < 30000) return null;
            localStorage.setItem('mrx_last_advice', Date.now().toString());
        }

        return suggestions[Math.floor(Math.random() * suggestions.length)];
    }
};
