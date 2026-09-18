/**
 * Email Quality & Developer Experience Analyzer
 * 
 * Factual, client-side static analysis performed on authoritative rendered HTML.
 * Analyzes:
 * - Exact UTF-8 byte payload size and proximity to Gmail's 102KB clipping threshold
 * - Size breakdown (HTML structure, inline CSS, text content, attributes)
 * - Email accessibility (missing alt attributes, empty links, document language, title, table semantics)
 * - Email client compatibility (scripts, forms, embedded media, CSS positioning, MSO conditionals)
 * - Markup quality (placeholder links, unclosed tags)
 * 
 * Strict Principle:
 * - NO numerical fake scores (e.g. no "90/100" score).
 * - Simple severity model: ERROR, WARNING, INFO.
 * - Every diagnostic is based on observable markup facts.
 */

export type DiagnosticSeverity = 'error' | 'warning' | 'info';
export type DiagnosticCategory = 'size' | 'accessibility' | 'compatibility' | 'markup';
export type GmailClipStatus = 'safe' | 'warning' | 'critical';

export interface QualityDiagnostic {
  id: string;
  category: DiagnosticCategory;
  severity: DiagnosticSeverity;
  title: string;
  message: string;
  recommendation?: string;
  count?: number;
}

export interface SizeBreakdown {
  totalBytes: number;
  totalKb: number;
  htmlMarkupBytes: number;
  inlineCssBytes: number;
  textContentBytes: number;
  attributesBytes: number;
  otherBytes: number;
}

export interface EmailQualityReport {
  size: {
    bytes: number;
    kb: number;
    thresholdBytes: number; // 104,448 (102 * 1024)
    warningThresholdBytes: number; // 81,920 (80 * 1024)
    percentageOfLimit: number;
    status: GmailClipStatus;
    breakdown: SizeBreakdown;
  };
  diagnostics: QualityDiagnostic[];
  counts: {
    errors: number;
    warnings: number;
    info: number;
    total: number;
  };
  metadata: {
    linkCount: number;
    imageCount: number;
    tableCount: number;
    hasMsoConditions: boolean;
    hasLangAttribute: boolean;
    hasTitle: boolean;
  };
  analyzedAt: number;
}

// 102KB in binary bytes (102 * 1024)
export const GMAIL_CLIPPING_THRESHOLD_BYTES = 104448;
export const GMAIL_WARNING_THRESHOLD_BYTES = 81920; // ~80KB

const utf8Encoder = new TextEncoder();

/**
 * Calculates accurate UTF-8 byte size and structural breakdown.
 */
export function calculateEmailSize(html: string): {
  bytes: number;
  kb: number;
  thresholdBytes: number;
  warningThresholdBytes: number;
  percentageOfLimit: number;
  status: GmailClipStatus;
  breakdown: SizeBreakdown;
} {
  if (!html || typeof html !== 'string') {
    return {
      bytes: 0,
      kb: 0,
      thresholdBytes: GMAIL_CLIPPING_THRESHOLD_BYTES,
      warningThresholdBytes: GMAIL_WARNING_THRESHOLD_BYTES,
      percentageOfLimit: 0,
      status: 'safe',
      breakdown: {
        totalBytes: 0,
        totalKb: 0,
        htmlMarkupBytes: 0,
        inlineCssBytes: 0,
        textContentBytes: 0,
        attributesBytes: 0,
        otherBytes: 0,
      }
    };
  }

  const totalBytes = utf8Encoder.encode(html).length;
  const totalKb = parseFloat((totalBytes / 1024).toFixed(2));
  const percentageOfLimit = parseFloat(((totalBytes / GMAIL_CLIPPING_THRESHOLD_BYTES) * 100).toFixed(1));

  let status: GmailClipStatus = 'safe';
  if (totalBytes > GMAIL_CLIPPING_THRESHOLD_BYTES) {
    status = 'critical';
  } else if (totalBytes > GMAIL_WARNING_THRESHOLD_BYTES) {
    status = 'warning';
  }

  // 1. Calculate CSS Bytes: <style> blocks + style="..." attributes
  let inlineCssBytes = 0;
  const styleTagMatches = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
  for (const tag of styleTagMatches) {
    inlineCssBytes += utf8Encoder.encode(tag).length;
  }

  const styleAttrMatches = html.match(/\bstyle\s*=\s*(["'])([\s\S]*?)\1/gi) || [];
  for (const attr of styleAttrMatches) {
    inlineCssBytes += utf8Encoder.encode(attr).length;
  }

  // 2. Calculate Text Content Bytes (text nodes stripped of all HTML tags)
  const textContent = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
                          .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
                          .replace(/<!--[\s\S]*?-->/g, '')
                          .replace(/<[^>]+>/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim();
  const textContentBytes = utf8Encoder.encode(textContent).length;

  // 3. Calculate Attributes Bytes (excluding style attributes already counted)
  let attributesBytes = 0;
  const tagContentMatches = html.match(/<[a-z0-9]+(\s+[^>]+)>/gi) || [];
  for (const tagWithAttrs of tagContentMatches) {
    // Remove tag name and enclosing brackets
    const attrsString = tagWithAttrs.replace(/^<[a-z0-9]+\s+/i, '').replace(/>$/, '');
    // Strip style="..." attribute from this string so we don't double count CSS
    const nonStyleAttrs = attrsString.replace(/\bstyle\s*=\s*(["'])([\s\S]*?)\1/gi, '');
    attributesBytes += utf8Encoder.encode(nonStyleAttrs).length;
  }

  // 4. Calculate Structural Tags & Doctype & Comments
  const strippedOfAttrs = html.replace(/<([a-z0-9]+)(\s+[^>]+)>/gi, '<$1>');
  const structuralTags = strippedOfAttrs.match(/<\/?[a-z0-9]+>|<!DOCTYPE[^>]*>|<!--[\s\S]*?-->/gi) || [];
  let htmlMarkupBytes = 0;
  for (const tag of structuralTags) {
    htmlMarkupBytes += utf8Encoder.encode(tag).length;
  }

  // Calculate remainder to ensure exact accounting
  const accounted = inlineCssBytes + textContentBytes + attributesBytes + htmlMarkupBytes;
  const otherBytes = Math.max(0, totalBytes - accounted);

  return {
    bytes: totalBytes,
    kb: totalKb,
    thresholdBytes: GMAIL_CLIPPING_THRESHOLD_BYTES,
    warningThresholdBytes: GMAIL_WARNING_THRESHOLD_BYTES,
    percentageOfLimit,
    status,
    breakdown: {
      totalBytes,
      totalKb,
      htmlMarkupBytes,
      inlineCssBytes,
      textContentBytes,
      attributesBytes,
      otherBytes
    }
  };
}

/**
 * Performs full quality audit on rendered HTML.
 */
export function auditEmailQuality(html: string): EmailQualityReport {
  const analyzedAt = Date.now();
  const sizeInfo = calculateEmailSize(html);
  const diagnostics: QualityDiagnostic[] = [];

  if (!html || typeof html !== 'string' || html.trim().length === 0) {
    return {
      size: sizeInfo,
      diagnostics: [
        {
          id: 'empty-payload',
          category: 'markup',
          severity: 'error',
          title: 'Empty Email Content',
          message: 'No rendered HTML output was generated to analyze.',
          recommendation: 'Check the template code in the editor for syntax or rendering errors.'
        }
      ],
      counts: { errors: 1, warnings: 0, info: 0, total: 1 },
      metadata: {
        linkCount: 0,
        imageCount: 0,
        tableCount: 0,
        hasMsoConditions: false,
        hasLangAttribute: false,
        hasTitle: false,
      },
      analyzedAt
    };
  }

  // Metadata collection
  const linkMatches = html.match(/<a\b[^>]*>/gi) || [];
  const imageMatches = html.match(/<img\b[^>]*>/gi) || [];
  const tableMatches = html.match(/<table\b[^>]*>/gi) || [];
  const hasMsoConditions = /<!--\s*\[if\s+(?:mso|!mso)[\s\S]*?\]-->/i.test(html);
  const hasLangAttribute = /<html\b[^>]*\blang\s*=\s*["'][a-z]{2,}(?:-[a-z0-9]+)?["']/i.test(html);
  const hasTitle = /<title\b[^>]*>([^<]+)<\/title>/i.test(html) && !/<title\b[^>]*>\s*<\/title>/i.test(html);

  // -------------------------------------------------------------
  // 1. SIZE DIAGNOSTICS
  // -------------------------------------------------------------
  if (sizeInfo.status === 'critical') {
    diagnostics.push({
      id: 'size-critical',
      category: 'size',
      severity: 'error',
      title: 'HTML payload exceeds 102KB (Gmail Clipping Risk)',
      message: `Generated HTML is ${sizeInfo.kb} KB (${sizeInfo.bytes.toLocaleString()} bytes), which exceeds the ~102KB (104,448 bytes) Gmail clipping threshold.`,
      recommendation: 'Gmail is likely to truncate this message with "[Message clipped] View entire message". Reduce inline styles, optimize markup, or split content.'
    });
  } else if (sizeInfo.status === 'warning') {
    diagnostics.push({
      id: 'size-warning',
      category: 'size',
      severity: 'warning',
      title: 'Approaching Gmail clipping threshold',
      message: `Generated HTML is ${sizeInfo.kb} KB (${sizeInfo.bytes.toLocaleString()} bytes), utilizing ${sizeInfo.percentageOfLimit}% of the 102KB Gmail clipping threshold.`,
      recommendation: 'Maintain a safe margin below 102KB to reduce the risk of message clipping across mobile and web email clients.'
    });
  } else {
    diagnostics.push({
      id: 'size-safe',
      category: 'size',
      severity: 'info',
      title: 'Payload size safely within limits',
      message: `Generated HTML is ${sizeInfo.kb} KB (${sizeInfo.bytes.toLocaleString()} bytes), well below the 102KB Gmail clipping threshold.`
    });
  }

  // -------------------------------------------------------------
  // 2. ACCESSIBILITY DIAGNOSTICS
  // -------------------------------------------------------------
  // 2a. Images missing alt attribute vs decorative empty alt vs poor alt
  let missingAltCount = 0;
  let emptyAltCount = 0;
  let poorAltCount = 0;

  for (const img of imageMatches) {
    if (!/\balt\s*=/i.test(img)) {
      missingAltCount++;
    } else {
      // Check for empty alt (decorative image: valid WCAG technique)
      if (/\balt\s*=\s*["']\s*["']/i.test(img)) {
        emptyAltCount++;
      } else {
        // Check for potentially poor/generic alt text
        const altMatch = img.match(/\balt\s*=\s*["']([^"']+)["']/i);
        if (altMatch) {
          const altText = altMatch[1].trim().toLowerCase();
          if (['image', 'photo', 'picture', 'graphic', 'img', 'banner'].includes(altText)) {
            poorAltCount++;
          }
        }
      }
    }
  }

  if (missingAltCount > 0) {
    diagnostics.push({
      id: 'a11y-missing-alt',
      category: 'accessibility',
      severity: 'error',
      title: 'Images missing alt attribute',
      message: `${missingAltCount} image(s) in this template lack an alt attribute entirely.`,
      recommendation: 'Add alt="..." with descriptive text for informative images, or alt="" for decorative graphics so assistive screen readers skip them cleanly.',
      count: missingAltCount
    });
  }

  if (poorAltCount > 0) {
    diagnostics.push({
      id: 'a11y-poor-alt',
      category: 'accessibility',
      severity: 'warning',
      title: 'Potentially non-descriptive image alt text',
      message: `${poorAltCount} image(s) use generic alt text such as "image" or "photo".`,
      recommendation: 'Use descriptive text explaining what the image shows, or use alt="" if the image is purely decorative.',
      count: poorAltCount
    });
  }

  if (emptyAltCount > 0) {
    diagnostics.push({
      id: 'a11y-decorative-alt',
      category: 'accessibility',
      severity: 'info',
      title: 'Decorative images with empty alt (alt="")',
      message: `${emptyAltCount} image(s) have empty alt attributes (alt=""), which indicates decorative imagery according to WCAG guidelines.`,
      count: emptyAltCount
    });
  }

  // 2b. Missing document language
  if (!hasLangAttribute) {
    diagnostics.push({
      id: 'a11y-missing-lang',
      category: 'accessibility',
      severity: 'warning',
      title: 'Missing HTML document language',
      message: 'The root <html> tag does not define a valid lang attribute (e.g., lang="en").',
      recommendation: 'Specify lang="en" (or the appropriate language code) on <html> to ensure assistive technologies apply correct pronunciation rules.'
    });
  }

  // 2c. Missing or empty <title>
  if (!hasTitle) {
    diagnostics.push({
      id: 'a11y-missing-title',
      category: 'accessibility',
      severity: 'info',
      title: 'Missing or empty <title> tag',
      message: 'The email <head> does not contain a descriptive <title> element.',
      recommendation: 'Add a <title> tag matching your subject line. Web-based email clients and assistive screen readers use this title for tab navigation.'
    });
  }

  // 2d. Empty links
  const emptyLinkMatches = html.match(/<a\b[^>]*>(\s*)<\/a>/gi) || [];
  if (emptyLinkMatches.length > 0) {
    diagnostics.push({
      id: 'a11y-empty-links',
      category: 'accessibility',
      severity: 'warning',
      title: 'Empty link elements detected',
      message: `Found ${emptyLinkMatches.length} link tag(s) with no text content or child elements.`,
      recommendation: 'Ensure all <a> elements contain discernible, meaningful text or child elements with accessible labels.',
      count: emptyLinkMatches.length
    });
  }

  // 2e. Non-descriptive anchor text ("click here", "here") - Heuristic check
  const genericLinkPattern = /<a\b[^>]*>\s*(?:click\s+here|here|read\s+more|link|learn\s+more)\s*<\/a>/gi;
  const genericLinkMatches = html.match(genericLinkPattern) || [];
  if (genericLinkMatches.length > 0) {
    diagnostics.push({
      id: 'a11y-generic-links',
      category: 'accessibility',
      severity: 'info',
      title: 'Potentially non-descriptive link text (Heuristic)',
      message: `Found ${genericLinkMatches.length} link(s) using generic text like "click here" or "read more". This is a heuristic check: screen reader users often navigate links in a list, where destination context is helpful.`,
      recommendation: 'Use descriptive text indicating the destination (e.g., "View order invoice" rather than "Click here").',
      count: genericLinkMatches.length
    });
  }

  // 2f. Table semantics for layout tables
  if (tableMatches.length > 0) {
    let tablesWithoutRole = 0;
    for (const table of tableMatches) {
      if (!/\brole\s*=\s*["'](?:presentation|none)["']/i.test(table)) {
        tablesWithoutRole++;
      }
    }
    if (tablesWithoutRole > 0) {
      diagnostics.push({
        id: 'a11y-table-role',
        category: 'accessibility',
        severity: 'info',
        title: 'Layout tables without presentation role',
        message: `${tablesWithoutRole} of ${tableMatches.length} table(s) omit role="presentation" or role="none".`,
        recommendation: 'Add role="presentation" to layout tables so screen readers do not announce row and column coordinates for visual containers.',
        count: tablesWithoutRole
      });
    }
  }

  // -------------------------------------------------------------
  // 3. COMPATIBILITY DIAGNOSTICS
  // -------------------------------------------------------------
  // 3a. JavaScript in email
  const hasScripts = /<script\b[^>]*>[\s\S]*?<\/script>/i.test(html) ||
                     /\bon[a-z]+\s*=\s*["'][^"']*["']/i.test(html) ||
                     /\bhref\s*=\s*["']javascript:/i.test(html);
  if (hasScripts) {
    diagnostics.push({
      id: 'compat-javascript',
      category: 'compatibility',
      severity: 'error',
      title: 'JavaScript detected in email markup',
      message: 'Found <script> tags, inline event handlers (onclick/onload), or javascript: URIs in rendered output.',
      recommendation: 'Major email clients (Gmail, Outlook, Apple Mail) universally strip or flag JavaScript as malicious. Remove all client-side scripts.'
    });
  }

  // 3b. Interactive form elements
  const formElementMatches = html.match(/<(?:form|input|textarea|select|button\s+type\s*=\s*["']submit["'])\b[^>]*>/gi) || [];
  if (formElementMatches.length > 0) {
    diagnostics.push({
      id: 'compat-forms',
      category: 'compatibility',
      severity: 'warning',
      title: 'Interactive form elements (Potential compatibility issue)',
      message: `Found ${formElementMatches.length} form element(s) (<form>, <input>, etc.). Form support is inconsistent across email clients.`,
      recommendation: 'Most email clients disable form submissions or trigger phishing warnings. Replace interactive forms with a styled CTA button directing to a web landing page.',
      count: formElementMatches.length
    });
  }

  // 3c. Video / Audio / Flash / Object / Embed / Iframe
  const mediaMatches = html.match(/<(?:video|audio|iframe|embed|object)\b[^>]*>/gi) || [];
  if (mediaMatches.length > 0) {
    diagnostics.push({
      id: 'compat-embedded-media',
      category: 'compatibility',
      severity: 'warning',
      title: 'Embedded media elements (Potential compatibility issue)',
      message: `Found ${mediaMatches.length} embedded media tag(s) (<video>, <audio>, <iframe>, etc.).`,
      recommendation: 'Embedded media is blocked by the vast majority of desktop and mobile email clients. Use a static preview image with a play button linking to hosted media.',
      count: mediaMatches.length
    });
  }

  // 3d. CSS Positioning (position: absolute / fixed)
  const hasAbsoluteOrFixed = /position\s*:\s*(?:absolute|fixed)/i.test(html);
  if (hasAbsoluteOrFixed) {
    diagnostics.push({
      id: 'compat-css-positioning',
      category: 'compatibility',
      severity: 'warning',
      title: 'CSS positioning (Potential compatibility issue)',
      message: 'Found "position: absolute" or "position: fixed". These properties are ignored or distorted by Outlook and web clients.',
      recommendation: 'Use nested tables, padding, and vertical-align alignments instead of CSS positioning for consistent layout geometry.'
    });
  }

  // 3e. MSO / Outlook Conditional Comments
  if (hasMsoConditions) {
    diagnostics.push({
      id: 'compat-mso-comments',
      category: 'compatibility',
      severity: 'info',
      title: 'Outlook MSO conditional comments detected',
      message: 'Email includes specialized <!--[if mso]> conditional comments for Microsoft Outlook desktop client rendering.'
    });
  }

  // -------------------------------------------------------------
  // 4. MARKUP & LINK DIAGNOSTICS
  // -------------------------------------------------------------
  // 4a. Placeholder links (href="#" or href="")
  const placeholderLinkMatches = html.match(/<a\b[^>]*\bhref\s*=\s*["'](?:#|javascript:void\(0\)|)?["']/gi) || [];
  if (placeholderLinkMatches.length > 0) {
    diagnostics.push({
      id: 'markup-placeholder-links',
      category: 'markup',
      severity: 'info',
      title: 'Placeholder or empty links detected',
      message: `Found ${placeholderLinkMatches.length} link(s) using placeholder URLs (such as href="#").`,
      recommendation: 'Verify that all destination URLs are configured with live production endpoints prior to campaign distribution.',
      count: placeholderLinkMatches.length
    });
  }

  // Calculate diagnostic counts
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  for (const d of diagnostics) {
    if (d.severity === 'error') errorCount++;
    else if (d.severity === 'warning') warningCount++;
    else if (d.severity === 'info') infoCount++;
  }

  return {
    size: sizeInfo,
    diagnostics,
    counts: {
      errors: errorCount,
      warnings: warningCount,
      info: infoCount,
      total: diagnostics.length
    },
    metadata: {
      linkCount: linkMatches.length,
      imageCount: imageMatches.length,
      tableCount: tableMatches.length,
      hasMsoConditions,
      hasLangAttribute,
      hasTitle
    },
    analyzedAt
  };
}

/**
 * Strips internal worker details, filesystem paths, and environment traces from compiler error messages
 * ensuring error UX is concise, user-facing, and clean.
 */
export function sanitizeRenderError(rawError: string | null | undefined): string {
  if (!rawError) return 'An error occurred during template compilation.';
  
  let cleaned = String(rawError);

  // Remove absolute file system paths (e.g., /app/applet/..., /tmp/..., etc.)
  cleaned = cleaned.replace(/(?:\/[a-zA-Z0-9_.-]+)+/g, (match) => {
    // Keep standard email tags/syntax if any, but replace paths
    if (match.includes('/') && !match.startsWith('</')) {
      const parts = match.split('/');
      return parts[parts.length - 1] || 'template.tsx';
    }
    return match;
  });

  // Remove stack trace line numbers and node internal traces
  cleaned = cleaned.replace(/^\s*at\s+.*$/gm, '');
  cleaned = cleaned.replace(/\bnode:internal\S+/g, '');
  cleaned = cleaned.replace(/\s*\(file:\/\/[^)]+\)/g, '');

  // Strip process or worker internal messages
  cleaned = cleaned.replace(/Worker exited with code null, signal SIGKILL/g, 'Execution timed out (maximum 2500ms exceeded)');
  cleaned = cleaned.replace(/Worker exited with code null, signal SIGABRT/g, 'Memory limit exceeded');

  // Trim excess empty lines
  cleaned = cleaned.split('\n').map(l => l.trimEnd()).filter((l, i, arr) => l.length > 0 || (i > 0 && arr[i-1].length > 0)).join('\n').trim();

  return cleaned || 'Template compilation failed. Please review your TSX/HTML syntax.';
}
