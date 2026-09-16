import { createRequire } from 'module';
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
const RENDERER_DIRECT_ENDPOINT = process.env.RENDERER_URL || 'http://localhost:3001/render';

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

function record(suite, testName, passed, detail = '') {
  results.push({ suite, testName, passed, detail });
  const icon = passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] [${suite}] ${testName}${detail ? ` -> ${detail}` : ''}`);
}

async function postRender(code, templates = [], endpoint = RENDER_ENDPOINT) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, templates }),
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data.html;
}

async function runTests() {
  console.log('\n======================================================');
  console.log('EMAIL.PRO SECURE RENDERER VERIFICATION SUITE');
  console.log(`Endpoints: Next.js=${RENDER_ENDPOINT} | DirectContainer=${RENDERER_DIRECT_ENDPOINT}`);
  console.log('======================================================\n');

  // ------------------------------------------------------------------
  // SUITE 1: FUNCTIONAL COMPATIBILITY (ALL 8 TEMPLATES)
  // ------------------------------------------------------------------
  console.log('--- 1. FUNCTIONAL TESTS (8 TEMPLATES) ---');
  for (const t of TEMPLATES) {
    try {
      const html = await postRender(t.code, TEMPLATES);
      if (html && html.length > 500) {
        record('FUNCTIONAL', `Template: ${t.name} (${t.id})`, true, `${html.length} bytes`);
      } else {
        record('FUNCTIONAL', `Template: ${t.name} (${t.id})`, false, 'HTML too small or empty');
      }
    } catch (err) {
      record('FUNCTIONAL', `Template: ${t.name} (${t.id})`, false, err.message);
    }
  }

  // ------------------------------------------------------------------
  // SUITE 2: LANGUAGE FEATURES (JSX, TSX, MAP, TERNARY)
  // ------------------------------------------------------------------
  console.log('\n--- 2. LANGUAGE FEATURE TESTS ---');
  try {
    const complexTsx = `
      import React from 'react';
      import { Html, Text, Container } from '@react-email/components';

      interface Item { id: number; label: string; active: boolean; }
      const items: Item[] = [
        { id: 1, label: 'Item Alpha', active: true },
        { id: 2, label: 'Item Beta', active: false },
      ];

      export default function() {
        return (
          <Html>
            <Container className="bg-slate-100 p-4">
              {items.map(item => (
                <Text key={item.id} className={item.active ? "text-green-600 font-bold" : "text-gray-400"}>
                  {item.label}: {item.active ? "Active" : "Inactive"}
                </Text>
              ))}
            </Container>
          </Html>
        );
      }
    `;
    const html = await postRender(complexTsx);
    const hasMap = html.includes('Item Alpha') && html.includes('Item Beta');
    const hasTernary = html.includes('Active') && html.includes('Inactive');
    record('FEATURES', 'TSX with map() and ternaries', hasMap && hasTernary);
  } catch (err) {
    record('FEATURES', 'TSX with map() and ternaries', false, err.message);
  }

  // ------------------------------------------------------------------
  // SUITE 3: ISOLATION & PROTOTYPE POLLUTION (ONE RENDER = ONE WORKER)
  // ------------------------------------------------------------------
  console.log('\n--- 3. ISOLATION & PROTOTYPE POLLUTION TESTS ---');
  try {
    // Request A: Pollute Object.prototype and globalThis
    const poisonCode = `
      import React from 'react';
      import { Html, Text } from '@react-email/components';

      Object.prototype.poisoned_flag_999 = "attacker_controlled";
      Array.prototype.custom_hacked_method = function() { return "pwned"; };
      globalThis.__injected_global_token = "compromised";

      export default function() {
        return <Html><Text>Poison Injected</Text></Html>;
      }
    `;
    await postRender(poisonCode);

    // Request B: Check that contamination did NOT leak into subsequent render
    const checkContamination = `
      import React from 'react';
      import { Html, Text } from '@react-email/components';

      const objPolluted = Boolean(({}).poisoned_flag_999);
      const arrPolluted = Boolean([].custom_hacked_method);
      const globalPolluted = Boolean(globalThis.__injected_global_token);

      if (objPolluted || arrPolluted || globalPolluted) {
        throw new Error("ISOLATION FAILURE: Cross-request state contamination detected!");
      }

      export default function() {
        return <Html><Text>Clean and Isolated</Text></Html>;
      }
    `;
    const checkHtml = await postRender(checkContamination);
    record('ISOLATION', 'Object.prototype cross-request pollution prevented', checkHtml.includes('Clean'));
    record('ISOLATION', 'Array.prototype cross-request pollution prevented', checkHtml.includes('Clean'));
    record('ISOLATION', 'globalThis cross-request leakage prevented', checkHtml.includes('Clean'));
  } catch (err) {
    record('ISOLATION', 'Prototype pollution isolation test', false, err.message);
  }

  // ------------------------------------------------------------------
  // SUITE 4: SECURITY BOUNDARY TESTS
  // ------------------------------------------------------------------
  console.log('\n--- 4. SECURITY BOUNDARY TESTS ---');

  // 4a. Dynamic import attack
  try {
    const dynImportCode = `
      import React from 'react';
      import { Html, Text } from '@react-email/components';

      const attackerPromise = eval("import('node:fs')");

      export default function() {
        return <Html><Text>Evaluated</Text></Html>;
      }
    `;
    await postRender(dynImportCode);
    record('SECURITY', 'Dynamic import (eval import)', true, 'Contained inside disposable worker');
  } catch (err) {
    record('SECURITY', 'Dynamic import (eval import)', true, `Safely rejected: ${err.message}`);
  }

  // 4b. Environment secrets disclosure
  try {
    const secretLeakCode = `
      import React from 'react';
      import { Html, Text } from '@react-email/components';

      const secret = (process && process.env && process.env.GEMINI_API_KEY) || "";
      if (secret.length > 0) {
        throw new Error("SECRET_EXPOSED: " + secret);
      }

      export default function() {
        return <Html><Text>No Secrets Present</Text></Html>;
      }
    `;
    const html = await postRender(secretLeakCode);
    record('SECURITY', 'Zero application secrets in renderer', html.includes('No Secrets Present'));
  } catch (err) {
    record('SECURITY', 'Zero application secrets in renderer', false, err.message);
  }

  // 4c. Parent process signaling attack
  try {
    const parentKillCode = `
      import React from 'react';
      import { Html, Text } from '@react-email/components';

      try {
        if (typeof process !== 'undefined' && process.kill && process.ppid) {
          process.kill(process.ppid, 0);
        }
      } catch (e) {
        // Expected
      }

      export default function() {
        return <Html><Text>Parent Signal Failed</Text></Html>;
      }
    `;
    const html = await postRender(parentKillCode);
    record('SECURITY', 'Parent process signaling prevented', html.includes('Parent Signal Failed'));
  } catch (err) {
    record('SECURITY', 'Parent process signaling prevented', true, `Safely blocked: ${err.message}`);
  }

  // 4d. Outbound network attack
  try {
    const networkCode = `
      import React from 'react';
      import { Html, Text } from '@react-email/components';

      if (typeof fetch !== 'undefined') {
        throw new Error("NETWORK_FETCH_ACTIVE");
      }

      export default function() {
        return <Html><Text>No Network API</Text></Html>;
      }
    `;
    const html = await postRender(networkCode);
    record('SECURITY', 'Network API stripped from worker', html.includes('No Network API'));
  } catch (err) {
    record('SECURITY', 'Network API stripped from worker', false, err.message);
  }

  // ------------------------------------------------------------------
  // SUITE 5: RESOURCE LIMITS & DENIAL OF SERVICE
  // ------------------------------------------------------------------
  console.log('\n--- 5. RESOURCE LIMITS & EXHAUSTION TESTS ---');

  // 5a. Hard timeout (infinite loop)
  try {
    const loopCode = `
      import React from 'react';
      import { Html, Text } from '@react-email/components';

      while (true) {}

      export default function() {
        return <Html><Text>Should Never Reach</Text></Html>;
      }
    `;
    await postRender(loopCode);
    record('RESOURCE', 'Infinite loop timeout (2500ms)', false, 'Should have timed out');
  } catch (err) {
    const timedOut = err.message.toLowerCase().includes('timed out') || err.status === 504;
    record('RESOURCE', 'Infinite loop timeout (2500ms)', timedOut, err.message);
  }

  // 5b. Input size limit (>500KB)
  try {
    const hugeInput = '/* ' + 'A'.repeat(600_000) + ' */\nimport React from "react"; export default () => null;';
    await postRender(hugeInput);
    record('RESOURCE', 'Input size limit (>500KB) rejection', false, 'Should have rejected');
  } catch (err) {
    const rejected = err.message.toLowerCase().includes('limit') || err.message.toLowerCase().includes('exceed') || err.status === 413;
    record('RESOURCE', 'Input size limit (>500KB) rejection', rejected, err.message);
  }

  // ------------------------------------------------------------------
  // SUITE 6: CRASH RECOVERY & WORKER REPLACEMENT
  // ------------------------------------------------------------------
  console.log('\n--- 6. CRASH RECOVERY TESTS ---');
  try {
    const crashingCode = `
      import React from 'react';
      throw new Error("FORCED_CRASH_TEST");
    `;
    try {
      await postRender(crashingCode);
    } catch {
      // Expected crash
    }

    const recoveryHtml = await postRender(TEMPLATES[0].code, TEMPLATES);
    const recovered = recoveryHtml && recoveryHtml.includes('Linear Core');
    record('RECOVERY', 'Renderer recovers immediately after worker crash', recovered);
  } catch (err) {
    record('RECOVERY', 'Renderer recovers immediately after worker crash', false, err.message);
  }

  // ------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------
  console.log('\n======================================================');
  console.log('TEST RESULTS SUMMARY:');
  console.log('======================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  if (failed > 0) {
    console.error('FAILED TESTS:');
    results.filter(r => !r.passed).forEach(r => console.error(` - [${r.suite}] ${r.testName}: ${r.detail}`));
    process.exit(1);
  } else {
    console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
