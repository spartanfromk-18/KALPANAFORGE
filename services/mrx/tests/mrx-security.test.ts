/**
 * MR. X SECURITY TEST SUITE
 * Comprehensive testing for dual-layered security system
 */

import { scanForThreats, sanitize, sanitizeObject, quickThreatCheck } from '../core';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const results: TestResult[] = [];

/**
 * Test helper functions
 */
function test(name: string, fn: () => void | Promise<void>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(() => {
        results.push({ name, passed: true, message: 'Test passed' });
        console.log(`${colors.green}✓${colors.reset} ${name}`);
      }).catch((error) => {
        results.push({ name, passed: false, message: error.message });
        console.log(`${colors.red}✗${colors.reset} ${name}: ${error.message}`);
      });
    } else {
      results.push({ name, passed: true, message: 'Test passed' });
      console.log(`${colors.green}✓${colors.reset} ${name}`);
    }
  } catch (error: any) {
    results.push({ name, passed: false, message: error.message });
    console.log(`${colors.red}✗${colors.reset} ${name}: ${error.message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Malicious payload test cases
 */
const maliciousPayloads = {
  xss: [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<svg onload=alert("XSS")>',
    '<iframe src="javascript:alert(\'XSS\')">',
    'onclick="alert(\'XSS\')"',
    '<a href="javascript:void(0)">click</a>',
    '<object data="data:text/html,<script>alert(1)</script>">',
    'eval("alert(1)")',
    'setTimeout("alert(1)", 100)',
    'document.cookie',
    'window.location="http://evil.com"',
  ],

  sqlInjection: [
    "' OR '1'='1",
    "1; DROP TABLE users--",
    "admin'--",
    "' UNION SELECT * FROM users--",
    "1' AND 1=1--",
    "'; DELETE FROM users WHERE '1'='1",
    "1' OR '1'='1' /*",
    "EXEC xp_cmdshell('dir')",
  ],

  commandInjection: [
    "; ls -la",
    "| cat /etc/passwd",
    "$(whoami)",
    "`whoami`",
    "&& rm -rf /",
    "|| curl http://evil.com",
  ],

  pathTraversal: [
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32",
    "....//....//....//etc/passwd",
    "%2e%2e%2f%2e%2e%2f",
  ],

  prototypePollution: [
    '{"__proto__": {"admin": true}}',
    '{"constructor": {"prototype": {"admin": true}}}',
    'obj.__proto__.admin = true',
  ],

  ssrf: [
    'http://localhost:8080/admin',
    'http://127.0.0.1/admin',
    'http://169.254.169.254/latest/meta-data/',
    'http://metadata.google.internal/computeMetadata/v1/',
  ],

  noSqlInjection: [
    '{"$ne": null}',
    '{"$gt": ""}',
    '{"$where": "this.password == \'password\'"}',
    '{"$regex": ".*"}',
  ],
};

/**
 * Safe payload test cases (should NOT be blocked)
 */
const safePayloads = [
  'Hello, World!',
  'This is a normal text with numbers 12345',
  'Email: user@example.com',
  'Price: $99.99',
  'Math: 2 + 2 = 4',
  'URL: https://example.com',
  'Special chars: !@#$%^&*()',
  'Multiline\ntext\nwith\nbreaks',
  'Unicode: 你好世界 🌍',
  'Code snippet: const x = 5;',
];

/**
 * Run all tests
 */
async function runTests() {
  console.log(`\n${colors.cyan}===========================================`);
  console.log(`MR. X SECURITY TEST SUITE`);
  console.log(`=========================================== ${colors.reset}\n`);

  // Test 1: XSS Detection
  console.log(`\n${colors.blue}--- XSS Detection Tests ---${colors.reset}`);
  maliciousPayloads.xss.forEach((payload: string, i: number) => {
    test(`XSS Detection ${i + 1}: "${payload.substring(0, 50)}..."`, () => {
      const result = scanForThreats(payload);
      assert(result.isThreat, `Failed to detect XSS: ${payload}`);
      assert(result.threats.includes('XSS Attack'), 'Should identify as XSS Attack');
    });
  });

  // Test 2: SQL Injection Detection
  console.log(`\n${colors.blue}--- SQL Injection Detection Tests ---${colors.reset}`);
  maliciousPayloads.sqlInjection.forEach((payload: string, i: number) => {
    test(`SQL Injection Detection ${i + 1}: "${payload}"`, () => {
      const result = scanForThreats(payload);
      assert(result.isThreat, `Failed to detect SQL injection: ${payload}`);
      assert(result.threats.includes('SQL Injection'), 'Should identify as SQL Injection');
    });
  });

  // Test 3: Command Injection Detection
  console.log(`\n${colors.blue}--- Command Injection Detection Tests ---${colors.reset}`);
  maliciousPayloads.commandInjection.forEach((payload: string, i: number) => {
    test(`Command Injection Detection ${i + 1}: "${payload}"`, () => {
      const result = scanForThreats(payload);
      assert(result.isThreat, `Failed to detect command injection: ${payload}`);
      assert(result.threats.includes('Command Injection'), 'Should identify as Command Injection');
    });
  });

  // Test 4: Path Traversal Detection
  console.log(`\n${colors.blue}--- Path Traversal Detection Tests ---${colors.reset}`);
  maliciousPayloads.pathTraversal.forEach((payload: string, i: number) => {
    test(`Path Traversal Detection ${i + 1}: "${payload}"`, () => {
      const result = scanForThreats(payload);
      assert(result.isThreat, `Failed to detect path traversal: ${payload}`);
      assert(result.threats.includes('Path Traversal'), 'Should identify as Path Traversal');
    });
  });

  // Test 5: Prototype Pollution Detection
  console.log(`\n${colors.blue}--- Prototype Pollution Detection Tests ---${colors.reset}`);
  maliciousPayloads.prototypePollution.forEach((payload: string, i: number) => {
    test(`Prototype Pollution Detection ${i + 1}: "${payload}"`, () => {
      const result = scanForThreats(payload);
      assert(result.isThreat, `Failed to detect prototype pollution: ${payload}`);
      assert(result.threats.includes('Prototype Pollution'), 'Should identify as Prototype Pollution');
    });
  });

  // Test 6: SSRF Detection
  console.log(`\n${colors.blue}--- SSRF Detection Tests ---${colors.reset}`);
  maliciousPayloads.ssrf.forEach((payload: string, i: number) => {
    test(`SSRF Detection ${i + 1}: "${payload}"`, () => {
      const result = scanForThreats(payload);
      assert(result.isThreat, `Failed to detect SSRF: ${payload}`);
      assert(result.threats.includes('SSRF Attack'), 'Should identify as SSRF Attack');
    });
  });

  // Test 7: NoSQL Injection Detection
  console.log(`\n${colors.blue}--- NoSQL Injection Detection Tests ---${colors.reset}`);
  maliciousPayloads.noSqlInjection.forEach((payload: string, i: number) => {
    test(`NoSQL Injection Detection ${i + 1}: "${payload}"`, () => {
      const result = scanForThreats(payload);
      assert(result.isThreat, `Failed to detect NoSQL injection: ${payload}`);
      assert(result.threats.includes('NoSQL Injection'), 'Should identify as NoSQL Injection');
    });
  });

  // Test 8: Safe Payloads (Should NOT be blocked)
  console.log(`\n${colors.blue}--- Safe Payload Tests ---${colors.reset}`);
  safePayloads.forEach((payload: string, i: number) => {
    test(`Safe Payload ${i + 1}: "${payload}"`, () => {
      const result = scanForThreats(payload);
      assert(!result.isThreat, `False positive on safe payload: ${payload}`);
    });
  });

  // Test 9: Sanitization Tests
  console.log(`\n${colors.blue}--- Sanitization Tests ---${colors.reset}`);

  test('Sanitize XSS in standard mode', () => {
    const input = '<script>alert("XSS")</script>Hello';
    const output = sanitize(input, { mode: 'standard' });
    assert(!output.includes('<script'), 'Should remove script tags');
  });

  test('Sanitize XSS in supreme mode', () => {
    const input = '<img src=x onerror=alert(1)>';
    const output = sanitize(input, { mode: 'supreme' });
    assert(!output.includes('onerror'), 'Should remove event handlers');
    assert(!output.includes('<img'), 'Should remove img tags in supreme mode');
  });

  test('Sanitize SQL injection', () => {
    const input = "'; DROP TABLE users--";
    const output = sanitize(input, { mode: 'supreme' });
    assert(!output.includes('DROP'), 'Should remove DROP keyword');
  });

  test('Sanitize prototype pollution', () => {
    const input = '__proto__.admin = true';
    const output = sanitize(input, { mode: 'supreme' });
    assert(!output.includes('__proto__'), 'Should remove __proto__');
  });

  test('Sanitize with max length', () => {
    const input = 'A'.repeat(1000);
    const output = sanitize(input, { mode: 'standard', maxLength: 100 });
    assert(output.length === 100, 'Should truncate to max length');
  });

  // Test 10: Object Sanitization
  console.log(`\n${colors.blue}--- Object Sanitization Tests ---${colors.reset}`);

  test('Sanitize nested object', () => {
    const input = {
      name: 'John<script>alert(1)</script>',
      nested: {
        value: '<img src=x onerror=alert(1)>',
      },
    };
    const output = sanitizeObject(input, { mode: 'supreme' });
    assert(!JSON.stringify(output).includes('<script'), 'Should sanitize nested values');
    assert(!JSON.stringify(output).includes('onerror'), 'Should sanitize nested event handlers');
  });

  test('Sanitize array of strings', () => {
    const input = [
      'normal text',
      '<script>alert(1)</script>',
      'another normal text',
    ];
    const output = sanitizeObject(input, { mode: 'supreme' });
    assert(!output[1].includes('<script'), 'Should sanitize array elements');
  });

  // Test 11: Quick Threat Check
  console.log(`\n${colors.blue}--- Quick Threat Check Tests ---${colors.reset}`);

  test('Quick check detects script tag', () => {
    assert(quickThreatCheck('<script>alert(1)</script>'), 'Should quickly detect script tag');
  });

  test('Quick check detects javascript:', () => {
    assert(quickThreatCheck('javascript:alert(1)'), 'Should quickly detect javascript:');
  });

  test('Quick check passes safe string', () => {
    assert(!quickThreatCheck('Hello, World!'), 'Should not flag safe string');
  });

  // Test 12: Performance Tests
  console.log(`\n${colors.blue}--- Performance Tests ---${colors.reset}`);

  test('Scan performance on large payload', () => {
    const largePayload = 'safe text '.repeat(1000);
    const start = performance.now();
    scanForThreats(largePayload);
    const end = performance.now();
    const duration = end - start;
    assert(duration < 100, `Scan took too long: ${duration}ms`);
    console.log(`  ${colors.yellow}  Scan duration: ${duration.toFixed(2)}ms${colors.reset}`);
  });

  test('Quick check performance', () => {
    const payload = 'normal text without threats';
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      quickThreatCheck(payload);
    }
    const end = performance.now();
    const duration = end - start;
    assert(duration < 50, `Quick check too slow: ${duration}ms for 1000 iterations`);
    console.log(`  ${colors.yellow}  1000 quick checks: ${duration.toFixed(2)}ms${colors.reset}`);
  });

  // Print summary
  console.log(`\n${colors.cyan}===========================================`);
  console.log(`TEST SUMMARY`);
  console.log(`===========================================`);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total: ${total}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%`);
  console.log(`=========================================== ${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}Failed tests:${colors.reset}`);
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }

  return failed === 0;
}

// Run tests if this is the main module
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { runTests, maliciousPayloads, safePayloads };
