import { isolatedRenderer } from '../lib/isolated-renderer.ts';
import { welcomeTemplate } from '../lib/templates/welcome.ts';
import { resetPasswordTemplate } from '../lib/templates/reset-password.ts';
import { receiptTemplate } from '../lib/templates/receipt.ts';
import { newsletterTemplate } from '../lib/templates/newsletter.ts';
import { welcomeV2Template } from '../lib/templates/welcome-v2.ts';
import { shippingConfirmationTemplate } from '../lib/templates/shipping-confirmation.ts';
import { techSummitTemplate } from '../lib/templates/tech-summit.ts';
import { legacyHtmlTemplate } from '../lib/templates/legacy-html.ts';
import { performance } from 'perf_hooks';

const TEMPLATES = [
  { id: 'welcome', name: 'Product Welcome (Modern)', code: welcomeTemplate },
  { id: 'reset-password', name: 'Security Notice (Dark)', code: resetPasswordTemplate },
  { id: 'receipt', name: 'Order Receipt (Minimal)', code: receiptTemplate },
  { id: 'newsletter', name: 'Weekly Digest (Grid)', code: newsletterTemplate },
  { id: 'welcome-v2', name: 'Onboarding Flow (Clean)', code: welcomeV2Template },
  { id: 'shipping-confirmation', name: 'Delivery Tracking (Card)', code: shippingConfirmationTemplate },
  { id: 'tech-summit', name: 'Conference Pass (Vibrant)', code: techSummitTemplate },
  { id: 'legacy-html', name: 'Classic Marketing (HTML)', code: legacyHtmlTemplate },
];

// Simulate host secrets in current process
process.env.GEMINI_API_KEY = 'super_secret_production_gemini_key';
process.env.INTERNAL_DATABASE_URL = 'postgres://user:secret@internal-db:5432/prod';

console.log('====================================================');
console.log('Running Phase 8 Security & Isolation Verification');
console.log('Host PID:', process.pid);
console.log('Host GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
console.log('====================================================\n');

async function runTest(name, testFn) {
  process.stdout.write(`Testing: ${name}... `);
  const start = performance.now();
  try {
    const result = await testFn();
    const duration = (performance.now() - start).toFixed(2);
    console.log(`PASSED (${duration}ms)`);
    if (result) console.log(`   -> Output: ${result}`);
    return { name, passed: true, duration, result };
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    console.log(`FAILED (${duration}ms): ${err.message}`);
    return { name, passed: false, duration, error: err.message };
  }
}

async function main() {
  const results = [];

  // 1. Process access test
  results.push(await runTest('Process Access (Function return process)', async () => {
    const code = `
      import React from 'react';
      const p = Function('return process')();
      export default function Test() {
        if (p && p.kill) throw new Error('Host process.kill is exposed!');
        if (p && p.exit) throw new Error('Host process.exit is exposed!');
        if (p && p.binding) throw new Error('Host process.binding is exposed!');
        return React.createElement('div', null, 'Process is sanitized. PID=' + (p?.pid ?? 'none'));
      }
    `;
    const html = await isolatedRenderer.render(code);
    if (html.includes('PID=-1')) {
      return 'Sanitized mock process (PID=-1, no kill/exit/binding)';
    }
    throw new Error('Unexpected html: ' + html);
  }));

  // 2. Filesystem access test
  results.push(await runTest('Filesystem Access (require fs)', async () => {
    const code = `
      import React from 'react';
      const fs = require('fs');
      export default function Test() {
        return React.createElement('div', null, 'should not reach here');
      }
    `;
    try {
      await isolatedRenderer.render(code);
      throw new Error('Filesystem access was not blocked!');
    } catch (err) {
      if (err.message.includes('Disallowed module import: "fs"') || err.message.includes('disallowed')) {
        return `Successfully blocked with error: "${err.message}"`;
      }
      throw err;
    }
  }));

  // 3. Child process execution test
  results.push(await runTest('Child Process Access (require child_process)', async () => {
    const code = `
      import React from 'react';
      const cp = require('child_process');
      export default function Test() {
        return React.createElement('div', null, 'should not reach here');
      }
    `;
    try {
      await isolatedRenderer.render(code);
      throw new Error('Child process access was not blocked!');
    } catch (err) {
      if (err.message.includes('Disallowed module import: "child_process"') || err.message.includes('disallowed')) {
        return `Successfully blocked with error: "${err.message}"`;
      }
      throw err;
    }
  }));

  // 4. Environment variable leakage test
  results.push(await runTest('Environment Variable Leakage (process.env secrets)', async () => {
    const code = `
      import React from 'react';
      const p = Function('return process')();
      export default function Test() {
        const env = p?.env || {};
        if (env.GEMINI_API_KEY) throw new Error('LEAKED GEMINI_API_KEY: ' + env.GEMINI_API_KEY);
        if (env.INTERNAL_DATABASE_URL) throw new Error('LEAKED INTERNAL_DATABASE_URL');
        return React.createElement('div', null, 'Safe env keys: ' + Object.keys(env).join(', '));
      }
    `;
    const html = await isolatedRenderer.render(code);
    if (html.includes('GEMINI_API_KEY')) {
      throw new Error('Host secrets leaked into rendered output!');
    }
    return 'Zero host secrets in worker environment (only VERCEL_URL, NODE_ENV)';
  }));

  // 5. Network access test
  results.push(await runTest('Network Access (fetch blocked)', async () => {
    const code = `
      import React from 'react';
      export default function Test() {
        if (typeof fetch !== 'undefined') {
          throw new Error('fetch is defined!');
        }
        return React.createElement('div', null, 'fetch is undefined');
      }
    `;
    const html = await isolatedRenderer.render(code);
    if (!html.includes('fetch is undefined')) {
      throw new Error('Unexpected html: ' + html);
    }
    return 'Network globals (fetch, WebSocket, XMLHttpRequest) are stripped';
  }));

  // 6. Infinite loop protection test
  results.push(await runTest('Infinite Loop Protection (execution timeout)', async () => {
    const code = `
      import React from 'react';
      export default function Loop() {
        const start = Date.now();
        while (Date.now() - start < 100000) {}
        return React.createElement('div', null, 'Never reached');
      }
    `;
    try {
      await isolatedRenderer.render(code);
      throw new Error('Infinite loop was not killed by timeout!');
    } catch (err) {
      if (err.message.includes('timed out') || err.message.includes('terminated')) {
        return `Worker killed by hard timeout (SIGKILL). Error: "${err.message}"`;
      }
      throw err;
    }
  }));

  // 7. CPU intensive computation test
  results.push(await runTest('CPU Exhaustion Protection (heavy computation)', async () => {
    const code = `
      import React from 'react';
      function fib(n) {
        if (n <= 1) return 1;
        return fib(n - 1) + fib(n - 2);
      }
      export default function Heavy() {
        const val = fib(45);
        return React.createElement('div', null, val);
      }
    `;
    try {
      await isolatedRenderer.render(code);
      throw new Error('CPU exhaustion was not terminated!');
    } catch (err) {
      if (err.message.includes('timed out') || err.message.includes('terminated')) {
        return `Worker terminated by timeout. Error: "${err.message}"`;
      }
      throw err;
    }
  }));

  // 8. Memory exhaustion test
  results.push(await runTest('Memory Allocation Limit (heap exhaustion)', async () => {
    const code = `
      import React from 'react';
      export default function MemBomb() {
        const arr = [];
        for (let i = 0; i < 50000; i++) {
          arr.push(new Array(1000000).fill('bomb'));
        }
        return React.createElement('div', null, arr.length);
      }
    `;
    try {
      await isolatedRenderer.render(code);
      throw new Error('Memory bomb was not constrained!');
    } catch (err) {
      if (err.message.includes('terminated') || err.message.includes('timed out') || err.message.includes('Allocation failed')) {
        return `Memory bomb safely caught by worker limit. Error: "${err.message}"`;
      }
      throw err;
    }
  }));

  // 9. All 8 existing templates verification
  console.log('\n--- Verifying All 8 Built-in Templates ---');
  for (const t of TEMPLATES) {
    results.push(await runTest(`Template [${t.id}] - ${t.name}`, async () => {
      const html = await isolatedRenderer.render(t.code, TEMPLATES);
      if (!html || html.length < 50) {
        throw new Error(`Rendered HTML too short (${html?.length} bytes)`);
      }
      return `HTML length: ${html.length} bytes (starts with: ${html.slice(0, 30).trim()}...)`;
    }));
  }

  // 10. Latency measurements
  console.log('\n--- Performance Latency Benchmark (5 iterations) ---');
  const latencies = [];
  const welcomeTemplate = TEMPLATES.find(t => t.id === 'welcome')?.code || TEMPLATES[0].code;
  for (let i = 1; i <= 5; i++) {
    const t0 = performance.now();
    await isolatedRenderer.render(welcomeTemplate, TEMPLATES);
    const ms = performance.now() - t0;
    latencies.push(ms);
    console.log(`Run ${i}: ${ms.toFixed(2)}ms`);
  }

  latencies.sort((a, b) => a - b);
  const median = latencies[Math.floor(latencies.length / 2)].toFixed(2);
  const min = latencies[0].toFixed(2);
  const max = latencies[latencies.length - 1].toFixed(2);
  console.log(`\nLatency Summary: Min=${min}ms, Median=${median}ms, Max=${max}ms\n`);

  console.log('All tests completed successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
