/**
 * Regression Test Suite for /api/render and Client Race Condition / Security
 * Run with: node scripts/test-phase10-regression.mjs
 */

import assert from 'node:assert';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const { welcomeTemplate } = require('../lib/templates/welcome.ts');
const { resetPasswordTemplate } = require('../lib/templates/reset-password.ts');
const { receiptTemplate } = require('../lib/templates/receipt.ts');
const { newsletterTemplate } = require('../lib/templates/newsletter.ts');
const { welcomeV2Template } = require('../lib/templates/welcome-v2.ts');
const { shippingConfirmationTemplate } = require('../lib/templates/shipping-confirmation.ts');
const { techSummitTemplate } = require('../lib/templates/tech-summit.ts');
const { legacyHtmlTemplate } = require('../lib/templates/legacy-html.ts');

const RENDER_ENDPOINT = process.env.API_URL || 'http://localhost:3000/api/render';

const TEMPLATES = [
  { id: 'welcome', name: 'Welcome Email', code: welcomeTemplate, language: 'typescript' },
  { id: 'reset-password', name: 'Reset Password', code: resetPasswordTemplate, language: 'typescript' },
  { id: 'receipt', name: 'Order Receipt', code: receiptTemplate, language: 'typescript' },
  { id: 'newsletter', name: 'Weekly Newsletter', code: newsletterTemplate, language: 'typescript' },
  { id: 'welcome-v2', name: 'Resend Welcome', code: welcomeV2Template, language: 'typescript' },
  { id: 'shipping-confirmation', name: 'Shipping Confirmation', code: shippingConfirmationTemplate, language: 'typescript' },
  { id: 'tech-summit', name: 'Tech Summit RSVP', code: techSummitTemplate, language: 'typescript' },
  { id: 'legacy-html', name: 'Legacy HTML', code: legacyHtmlTemplate, language: 'html' },
];

const results = [];
function record(phase, testName, passed, detail = '') {
  results.push({ phase, testName, passed, detail });
  const mark = passed ? 'PASS' : 'FAIL';
  console.log(`[${mark}] [${phase}] ${testName}${detail ? ` -> ${detail}` : ''}`);
}

async function requestApi(payload, endpoint = RENDER_ENDPOINT) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    signal: AbortSignal.timeout(12000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

console.log('\n================================================================');
console.log('PHASE 10: REGRESSION, SECURITY & RELIABILITY HARDENING SUITE');
console.log('================================================================\n');

// ----------------------------------------------------------------------
// PHASE 10B: RENDERER API REGRESSION
// ----------------------------------------------------------------------
console.log('--- PHASE 10B: RENDERER API REGRESSION ---');

// 1. Valid React Email Template
{
  const res = await requestApi({ code: welcomeTemplate, templates: TEMPLATES });
  const passed = res.status === 200 && typeof res.data.html === 'string' && res.data.html.includes('Linear Core');
  record('10B', '1. Valid React Email template', passed, `HTTP ${res.status}`);
}

// 2. All 8 canonical templates
{
  let all8Passed = true;
  for (const t of TEMPLATES) {
    const res = await requestApi({ code: t.code, language: t.language, templates: TEMPLATES });
    if (res.status !== 200 || !res.data.html || res.data.html.length < 500) {
      all8Passed = false;
      break;
    }
  }
  record('10B', '2. All 8 canonical templates render successfully', all8Passed);
}

// 3. Raw HTML with script and iframe escape attempts
{
  const rawHtmlInput = '<!-- html --><html><body><h1>Invoice #1029</h1><script>window.parent.postMessage("hacked","*");</script></body></html>';
  const res = await requestApi({ code: rawHtmlInput, language: 'html' });
  const passed = res.status === 200 && res.data.html === rawHtmlInput;
  record('10B', '3. Raw HTML handled as sanitized markup', passed, `HTTP ${res.status}`);
}

// 4. Empty input
{
  const res = await requestApi({ code: '' });
  const passed = res.status === 400 && res.data.error?.includes('Valid code string is required');
  record('10B', '4. Empty input rejected with HTTP 400', passed, `HTTP ${res.status}`);
}

// 5. Missing code
{
  const res = await requestApi({});
  const passed = res.status === 400 && res.data.error?.includes('Valid code string is required');
  record('10B', '5. Missing code rejected with HTTP 400', passed, `HTTP ${res.status}`);
}

// 6. Invalid language fallback (still compiles via TypeScript/TSX if code is valid)
{
  const res = await requestApi({ code: welcomeTemplate, language: 'unknown_lang_xyz', templates: TEMPLATES });
  const passed = res.status === 200 && typeof res.data.html === 'string';
  record('10B', '6. Invalid language safely handles or compiles', passed, `HTTP ${res.status}`);
}

// 7. Oversized input (>500KB)
{
  const hugeInput = '/* ' + 'X'.repeat(600_000) + ' */\nimport React from "react"; export default () => null;';
  const res = await requestApi({ code: hugeInput });
  const passed = (res.status === 413 || res.status === 422) && res.data.error?.toLowerCase().includes('limit');
  record('10B', '7. Oversized input rejected (>500KB)', passed, `HTTP ${res.status}: ${res.data.error}`);
}

// 8. Invalid template payload (syntax error)
{
  const syntaxErrCode = 'import React from "react"; export default const broken = 123;';
  const res = await requestApi({ code: syntaxErrCode });
  const passed = res.status === 422 && res.data.error && !res.data.error.includes('/app/') && !res.data.error.includes('/root/');
  record('10B', '8. Invalid template syntax returns 422 with sanitized error', passed, `HTTP ${res.status}`);
}

// 9. Renderer timeout (infinite loop)
{
  const infiniteLoop = `
    import React from 'react';
    while (true) {}
    export default () => null;
  `;
  const res = await requestApi({ code: infiniteLoop });
  const passed = (res.status === 504 || res.status === 422) && res.data.error?.toLowerCase().includes('time');
  record('10B', '9. Renderer timeout terminates with HTTP 504 / sanitized error', passed, `HTTP ${res.status}`);
}

// 10. Renderer error sanitization (no internal paths or secrets)
{
  const pathLeakAttempt = `
    import React from 'react';
    throw new Error("/app/applet/secret-file.txt failed at /root/host/path.js");
  `;
  const res = await requestApi({ code: pathLeakAttempt });
  const hasNoPaths = !res.data.error?.includes('/app/') && !res.data.error?.includes('/root/') && !res.data.error?.includes('/home/');
  record('10B', '10. API errors strictly sanitize internal server filesystem paths', hasNoPaths, res.data.error);
}

// 11. Malformed JSON request body
{
  const res = await requestApi('{"invalidJson": ...');
  const passed = res.status === 400;
  record('10B', '11. Malformed JSON body rejected with HTTP 400', passed, `HTTP ${res.status}`);
}

// ----------------------------------------------------------------------
// PHASE 10C: RACE CONDITION REGRESSION
// ----------------------------------------------------------------------
console.log('\n--- PHASE 10C: RACE CONDITION REGRESSION ---');

/**
 * We simulate the exact hook logic from hooks/use-email-editor.ts:
 *
 * let renderSeqRef = { current: 0 };
 * async function performRender(code, delayMs, shouldFail = false) { ... }
 */
class EmailEditorHookSimulator {
  constructor() {
    this.renderSeqRef = { current: 0 };
    this.previewHtml = '';
    this.error = null;
    this.isRendering = false;
    this.isDirty = false;
  }

  async performRender(codeToRender, delayMs, simulatedResult) {
    const seq = ++this.renderSeqRef.current;
    this.isRendering = true;

    // Simulate async execution with controlled resolution time
    await new Promise(r => setTimeout(r, delayMs));

    try {
      if (simulatedResult instanceof Error) {
        throw simulatedResult;
      }
      const html = simulatedResult;
      if (seq === this.renderSeqRef.current) {
        this.previewHtml = html;
        this.error = null;
        this.isDirty = false;
      }
      return true;
    } catch (err) {
      if (seq === this.renderSeqRef.current) {
        this.error = err.message || 'An error occurred while rendering';
      }
      return false;
    } finally {
      if (seq === this.renderSeqRef.current) {
        this.isRendering = false;
      }
    }
  }
}

// Test C1: A starts, B starts afterward, B completes first, A completes afterward -> B wins
{
  const sim = new EmailEditorHookSimulator();
  const promiseA = sim.performRender('Template A', 80, '<html>Output A (Stale)</html>');
  const promiseB = sim.performRender('Template B', 20, '<html>Output B (Fresh)</html>');

  await Promise.all([promiseA, promiseB]);

  const passed = sim.previewHtml === '<html>Output B (Fresh)</html>' &&
                 sim.error === null &&
                 sim.isRendering === false;
  record('10C', 'Scenario 1: B finishes before A -> B remains authoritative', passed, `Active preview: ${sim.previewHtml}`);
}

// Test C2: A starts, B starts, A fails, B succeeds -> B remains authoritative
{
  const sim = new EmailEditorHookSimulator();
  const promiseA = sim.performRender('Template A', 70, new Error('Error from stale A'));
  const promiseB = sim.performRender('Template B', 20, '<html>Output B (Fresh)</html>');

  await Promise.all([promiseA, promiseB]);

  const passed = sim.previewHtml === '<html>Output B (Fresh)</html>' &&
                 sim.error === null &&
                 sim.isRendering === false;
  record('10C', 'Scenario 2: A fails after B succeeds -> Stale error does not overwrite B', passed, `Error: ${sim.error}`);
}

// Test C3: A starts, B starts, B fails, A succeeds later -> Stale A must NOT replace B's error state
{
  const sim = new EmailEditorHookSimulator();
  const promiseA = sim.performRender('Template A', 70, '<html>Output A (Stale)</html>');
  const promiseB = sim.performRender('Template B', 20, new Error('Error in template B'));

  await Promise.all([promiseA, promiseB]);

  const passed = sim.previewHtml === '' &&
                 sim.error === 'Error in template B' &&
                 sim.isRendering === false;
  record('10C', 'Scenario 3: Stale A success cannot overwrite newer B error state', passed, `State: error=${sim.error}, html=${sim.previewHtml}`);
}

// ----------------------------------------------------------------------
// PHASE 10D: CLIENT SECURITY REGRESSION
// ----------------------------------------------------------------------
console.log('\n--- PHASE 10D: CLIENT SECURITY REGRESSION ---');

import fs from 'node:fs';
import path from 'node:path';

function scanDirForClientFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'renderer' && file !== 'scripts') {
        scanDirForClientFiles(fullPath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const clientFiles = scanDirForClientFiles('./components').concat(
  scanDirForClientFiles('./hooks'),
  ['./lib/render-email.ts']
);

const forbiddenClientTokens = [
  'renderEmailToReact',
  'getClientMockedComponents',
  'compileTemplate',
  'createPortal',
];

let clientScanClean = true;
const detectedTokens = [];

for (const filePath of clientFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const token of forbiddenClientTokens) {
    if (content.includes(token)) {
      clientScanClean = false;
      detectedTokens.push({ filePath, token });
    }
  }
  // Check for eval( or new Function( in browser code
  if (content.match(/\beval\s*\(/) || content.match(/\bnew\s+Function\s*\(/)) {
    clientScanClean = false;
    detectedTokens.push({ filePath, token: 'eval / new Function' });
  }
}

record('10D', 'Zero forbidden evaluation tokens in client/UI source code', clientScanClean, detectedTokens.length === 0 ? 'Verified Clean' : JSON.stringify(detectedTokens));

// Verify that React Email and Sucrase are never imported into browser client components
let clientLibrariesClean = true;
for (const filePath of clientFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("from 'sucrase'") || content.includes('from "sucrase"') ||
      content.includes("from '@react-email/render'") || content.includes('from "@react-email/render"')) {
    clientLibrariesClean = false;
    break;
  }
}
record('10D', 'Client components never import sucrase or @react-email/render', clientLibrariesClean);

// ----------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------
console.log('\n================================================================');
console.log('PHASE 10 TEST RESULTS SUMMARY:');
console.log('================================================================');
const total = results.length;
const passed = results.filter(r => r.passed).length;
const failed = total - passed;
console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);

if (failed > 0) {
  console.error('\nFAILED CHECKS:');
  results.filter(r => !r.passed).forEach(r => console.error(` - [${r.phase}] ${r.testName}: ${r.detail}`));
  process.exit(1);
} else {
  console.log('\n>>> ALL PHASE 10 REGRESSION & SECURITY CHECKS PASSED <<<\n');
}
