/**
 * Phase 14 Quality & Developer Experience Test Suite
 * 
 * Tests all 15 required checks from Phase 14R:
 * 1. Byte-size calculation (exact TextEncoder UTF-8 comparison)
 * 2. Below-threshold HTML (<80KB, safe)
 * 3. Near-threshold HTML (80KB-102KB, warning)
 * 4. Above-threshold HTML (>102KB, critical)
 * 5. Missing alt text detection (error)
 * 6. JavaScript detection (script tags, inline on*, javascript: href)
 * 7. External resource / embedded media detection (video, audio, iframe)
 * 8. Empty links detection
 * 9. Missing language detection
 * 10. Malformed/invalid HTML handling
 * 11. Clean email with minimal/safe diagnostics
 * 12. Multiple diagnostics accumulation
 * 13. Severity classification (error, warning, info)
 * 14. Analysis of actual rendered HTML from all 8 canonical templates
 * 15. Analyzer failure handling (null, empty, undefined input)
 */

import assert from 'node:assert';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const { 
  calculateEmailSize, 
  auditEmailQuality, 
  GMAIL_CLIPPING_THRESHOLD_BYTES, 
  GMAIL_WARNING_THRESHOLD_BYTES 
} = await import('../lib/email-quality.ts');

const { welcomeTemplate } = require('../lib/templates/welcome.ts');
const { resetPasswordTemplate } = require('../lib/templates/reset-password.ts');
const { receiptTemplate } = require('../lib/templates/receipt.ts');
const { newsletterTemplate } = require('../lib/templates/newsletter.ts');
const { welcomeV2Template } = require('../lib/templates/welcome-v2.ts');
const { shippingConfirmationTemplate } = require('../lib/templates/shipping-confirmation.ts');
const { techSummitTemplate } = require('../lib/templates/tech-summit.ts');
const { legacyHtmlTemplate } = require('../lib/templates/legacy-html.ts');

const CANONICAL_TEMPLATES = [
  { id: 'welcome', code: welcomeTemplate, language: 'typescript' },
  { id: 'reset-password', code: resetPasswordTemplate, language: 'typescript' },
  { id: 'receipt', code: receiptTemplate, language: 'typescript' },
  { id: 'newsletter', code: newsletterTemplate, language: 'typescript' },
  { id: 'welcome-v2', code: welcomeV2Template, language: 'typescript' },
  { id: 'shipping-confirmation', code: shippingConfirmationTemplate, language: 'typescript' },
  { id: 'tech-summit', code: techSummitTemplate, language: 'typescript' },
  { id: 'legacy-html', code: legacyHtmlTemplate, language: 'html' },
];

const results = [];
function record(testId, name, passed, detail = '') {
  results.push({ testId, name, passed, detail });
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] [Test ${testId}] ${name}${detail ? ` -> ${detail}` : ''}`);
}

console.log('\n======================================================');
console.log('PHASE 14 EMAIL QUALITY & DEVELOPER EXPERIENCE SUITE');
console.log('======================================================\n');

// 1. Byte-size calculation
{
  const testString = '<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body><p>Hello, 世界! 🚀</p></body></html>';
  const expectedBytes = new TextEncoder().encode(testString).length;
  const size = calculateEmailSize(testString);
  const passed = size.bytes === expectedBytes && size.kb === parseFloat((expectedBytes / 1024).toFixed(2));
  record(1, 'Byte-size calculation matches UTF-8 encoder', passed, `${size.bytes} bytes`);
}

// 2. Below-threshold HTML (<80KB)
{
  const smallHtml = '<!DOCTYPE html><html lang="en"><head><title>Small</title></head><body>' + 'A'.repeat(5000) + '</body></html>';
  const size = calculateEmailSize(smallHtml);
  const passed = size.status === 'safe' && size.bytes < GMAIL_WARNING_THRESHOLD_BYTES;
  record(2, 'Below-threshold HTML marked SAFE', passed, `${size.kb} KB, status=${size.status}`);
}

// 3. Near-threshold HTML (80KB - 102KB)
{
  const targetBytes = 90 * 1024; // 90KB
  const nearHtml = '<!DOCTYPE html><html lang="en"><head><title>Near</title></head><body>' + 'B'.repeat(targetBytes - 100) + '</body></html>';
  const size = calculateEmailSize(nearHtml);
  const passed = size.status === 'warning' && size.bytes >= GMAIL_WARNING_THRESHOLD_BYTES && size.bytes <= GMAIL_CLIPPING_THRESHOLD_BYTES;
  record(3, 'Near-threshold HTML (80-102KB) marked WARNING', passed, `${size.kb} KB, status=${size.status}`);
}

// 4. Above-threshold HTML (>102KB)
{
  const targetBytes = 110 * 1024; // 110KB
  const hugeHtml = '<!DOCTYPE html><html lang="en"><head><title>Huge</title></head><body>' + 'C'.repeat(targetBytes - 100) + '</body></html>';
  const report = auditEmailQuality(hugeHtml);
  const hasCriticalDiag = report.diagnostics.some(d => d.id === 'size-critical' && d.severity === 'error');
  const passed = report.size.status === 'critical' && hasCriticalDiag;
  record(4, 'Above-threshold HTML (>102KB) marked CRITICAL with ERROR diagnostic', passed, `${report.size.kb} KB`);
}

// 5. Missing alt text detection
{
  const htmlWithoutAlt = '<!DOCTYPE html><html lang="en"><head><title>T</title></head><body><img src="https://example.com/pic.png"><img src="https://example.com/pic2.png"></body></html>';
  const report = auditEmailQuality(htmlWithoutAlt);
  const altDiag = report.diagnostics.find(d => d.id === 'a11y-missing-alt');
  const passed = !!altDiag && altDiag.severity === 'error' && altDiag.count === 2;
  record(5, 'Missing alt text flagged as ERROR with exact count', passed, `Found ${altDiag?.count} missing`);
}

// 6. JavaScript detection
{
  const scriptHtml = '<!DOCTYPE html><html lang="en"><head><title>JS</title></head><body><button onclick="alert(1)">Click</button><script>console.log("bad");</script></body></html>';
  const report = auditEmailQuality(scriptHtml);
  const jsDiag = report.diagnostics.find(d => d.id === 'compat-javascript');
  const passed = !!jsDiag && jsDiag.severity === 'error';
  record(6, 'JavaScript presence (scripts & on* handlers) flagged as ERROR', passed);
}

// 7. External resource / embedded media detection
{
  const mediaHtml = '<!DOCTYPE html><html lang="en"><head><title>Media</title></head><body><video src="clip.mp4"></video><iframe src="https://example.com"></iframe></body></html>';
  const report = auditEmailQuality(mediaHtml);
  const mediaDiag = report.diagnostics.find(d => d.id === 'compat-embedded-media');
  const passed = !!mediaDiag && mediaDiag.severity === 'warning' && mediaDiag.count === 2;
  record(7, 'Embedded media tags (<video>, <iframe>) flagged as WARNING', passed, `Count: ${mediaDiag?.count}`);
}

// 8. Empty links detection
{
  const emptyLinksHtml = '<!DOCTYPE html><html lang="en"><head><title>Links</title></head><body><a href="https://example.com">   </a></body></html>';
  const report = auditEmailQuality(emptyLinksHtml);
  const emptyLinkDiag = report.diagnostics.find(d => d.id === 'a11y-empty-links');
  const passed = !!emptyLinkDiag && emptyLinkDiag.severity === 'warning';
  record(8, 'Empty <a> tags detected and flagged as WARNING', passed);
}

// 9. Missing document language detection
{
  const noLangHtml = '<html><head><title>Title</title></head><body><p>Hello</p></body></html>';
  const report = auditEmailQuality(noLangHtml);
  const langDiag = report.diagnostics.find(d => d.id === 'a11y-missing-lang');
  const passed = !!langDiag && langDiag.severity === 'warning';
  record(9, 'Missing lang attribute on <html> flagged as WARNING', passed);
}

// 10. Malformed/invalid HTML handling
{
  const malformedHtml = '<<<<not an html document>>>> <> <div style="color:red" <p>unclosed tags everywhere';
  let passed = false;
  try {
    const report = auditEmailQuality(malformedHtml);
    passed = typeof report.size.bytes === 'number' && Array.isArray(report.diagnostics);
  } catch (err) {
    passed = false;
  }
  record(10, 'Malformed HTML handled gracefully without throwing', passed);
}

// 11. Clean email with minimal/safe diagnostics
{
  const cleanHtml = `<!DOCTYPE html><html lang="en"><head><title>Order Confirmation #12345</title></head><body><table role="presentation"><tr><td><p>Thank you for your order.</p><img src="https://cdn.example.com/logo.png" alt="Company Logo"><a href="https://example.com/orders/12345">View your order details</a></td></tr></table></body></html>`;
  const report = auditEmailQuality(cleanHtml);
  const passed = report.counts.errors === 0 && report.size.status === 'safe';
  record(11, 'Clean semantic email reports 0 errors and SAFE size', passed, `Errors: ${report.counts.errors}, Warnings: ${report.counts.warnings}`);
}

// 12. Multiple diagnostics accumulation
{
  const multiIssueHtml = `<html><head></head><body><img src="pic.png"><a href="#"></a><video></video><script>1</script></body></html>`;
  const report = auditEmailQuality(multiIssueHtml);
  const passed = report.counts.errors >= 2 && report.counts.warnings >= 2 && report.counts.total >= 4;
  record(12, 'Multiple overlapping issues accumulated across categories', passed, `Total diagnostics: ${report.counts.total}`);
}

// 13. Severity classification (error, warning, info)
{
  const mixedHtml = `<!DOCTYPE html><html lang="en"><head><title>Title</title></head><body><!--[if mso]><p>Outlook</p><![endif]--><form action="/post"><input type="text"></form><script>alert(1)</script></body></html>`;
  const report = auditEmailQuality(mixedHtml);
  const hasError = report.diagnostics.some(d => d.severity === 'error');
  const hasWarning = report.diagnostics.some(d => d.severity === 'warning');
  const hasInfo = report.diagnostics.some(d => d.severity === 'info');
  const passed = hasError && hasWarning && hasInfo;
  record(13, 'Strict severity classification distinguishes ERROR, WARNING, and INFO', passed, `E:${report.counts.errors}, W:${report.counts.warnings}, I:${report.counts.info}`);
}

// 14. Analysis of actual rendered HTML from canonical templates
{
  const { localDisposableRenderer } = await import('../lib/local-disposable-renderer.ts');
  let all8Analyzed = true;
  for (const t of CANONICAL_TEMPLATES) {
    let renderedHtml = '';
    if (t.language === 'html') {
      renderedHtml = t.code;
    } else {
      renderedHtml = await localDisposableRenderer.render(t.code, []);
    }
    const report = auditEmailQuality(renderedHtml);
    if (!report || report.size.bytes < 1000 || typeof report.size.status !== 'string') {
      all8Analyzed = false;
      break;
    }
  }
  record(14, 'All 8 canonical templates analyzed successfully on authoritative HTML', all8Analyzed);
}

// 15. Analyzer failure handling (null/empty input)
{
  const emptyReport = auditEmailQuality('');
  const nullReport = auditEmailQuality(null);
  const passed = emptyReport.counts.errors === 1 && nullReport.counts.errors === 1 && emptyReport.size.bytes === 0;
  record(15, 'Empty/null inputs handled safely with structured error and zero crash', passed);
}

console.log('\n======================================================');
console.log('TEST RESULTS SUMMARY:');
console.log('======================================================');
const total = results.length;
const passedCount = results.filter(r => r.passed).length;
const failedCount = total - passedCount;
console.log(`TOTAL: ${total} | PASSED: ${passedCount} | FAILED: ${failedCount}`);

if (failedCount > 0) {
  console.error('\nFAILED TESTS:');
  results.filter(r => !r.passed).forEach(r => console.error(` - [${r.testId}] ${r.name}: ${r.detail}`));
  process.exit(1);
} else {
  console.log('\nALL 15 EMAIL QUALITY TESTS PASSED SUCCESSFULLY!\n');
}
