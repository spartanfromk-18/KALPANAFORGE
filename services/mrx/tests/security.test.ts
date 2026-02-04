import { scanForThreats, sanitize, quickThreatCheck } from '../core';

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
};

const results: { name: string; passed: boolean }[] = [];

function test(name: string, fn: () => void) {
    try {
        fn();
        results.push({ name, passed: true });
        console.log(`${colors.green}✓${colors.reset} ${name}`);
    } catch (error: any) {
        results.push({ name, passed: false });
        console.log(`${colors.red}✗${colors.reset} ${name}: ${error.message}`);
    }
}

function assert(condition: boolean, message: string) {
    if (!condition) throw new Error(message);
}

console.log(`\n${colors.cyan}=== MR. X SECURITY TEST SUITE ===${colors.reset}\n`);

test('Detects Basic XSS', () => {
    const result = scanForThreats('<script>alert(1)</script>');
    assert(result.isThreat, 'Should detect script tag');
    assert(result.threats.includes('XSS Attack'), 'Should identify as XSS');
});

test('Detects SQL Injection', () => {
    const result = scanForThreats("' OR '1'='1");
    assert(result.isThreat, 'Should detect SQLi');
    assert(result.threats.includes('SQL Injection'), 'Should identify as SQLi');
});

test('Sanitizes Supreme Mode', () => {
    const input = '<img src=x onerror=alert(1)>';
    const output = sanitize(input, { mode: 'supreme' });
    assert(!output.includes('onerror'), 'Should remove event handler');
    assert(!output.includes('<img'), 'Should remove img tag');
});

test('Quick Threat Check Performance', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
        quickThreatCheck('normal string');
    }
    const duration = performance.now() - start;
    assert(duration < 50, 'Quick check too slow');
});

const passed = results.filter(r => r.passed).length;
console.log(`\n${colors.cyan}--- SUMMARY ---${colors.reset}`);
console.log(`Passed: ${passed}/${results.length}`);
process.exit(passed === results.length ? 0 : 1);
