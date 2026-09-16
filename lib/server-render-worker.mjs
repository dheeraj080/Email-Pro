import { register } from 'node:module';
import { render } from '@react-email/render';
import * as EmailComponents from '@react-email/components';
import React from 'react';
import {
  isRawHtml,
  compileEmailElement,
} from './template-compiler.ts';

// Register Node.js ESM customization hook to eliminate dynamic import escape
const loaderCode = `
const ALLOWED_SPECIFIERS = new Set([
  'react-dom/server',
  'react-dom/server.edge',
  'react-dom/server.browser',
]);

export async function resolve(specifier, context, nextResolve) {
  if (ALLOWED_SPECIFIERS.has(specifier)) {
    return nextResolve(specifier, context);
  }
  throw new Error('BLOCKED_DYNAMIC_IMPORT: Import of "' + specifier + '" is strictly forbidden in template rendering.');
}
`;
register('data:text/javascript,' + encodeURIComponent(loaderCode), import.meta.url);

// Retain real IPC communication references in module closure before sanitizing
const ipcProcess = process;
const realSend = ipcProcess.send ? ipcProcess.send.bind(ipcProcess) : null;

// Deep-frozen safe mock process
const safeProcess = Object.freeze({
  env: Object.freeze({
    VERCEL_URL: 'react.email',
    NODE_ENV: 'production',
  }),
  platform: 'email-pro',
  arch: 'unknown',
  version: 'v0.0.0',
  pid: -1,
  cwd: () => '/app',
  uptime: () => 0,
});

// Strip network APIs and dangerous globals
try {
  delete globalThis.fetch;
  delete globalThis.WebSocket;
  delete globalThis.XMLHttpRequest;
  delete globalThis.process;
  globalThis.process = safeProcess;
  Object.defineProperty(globalThis, 'eval', {
    value: function() {
      throw new Error('DYNAMIC_EXECUTION_BLOCKED: eval() is disabled in template renderer.');
    },
    writable: false,
    configurable: false,
  });
} catch (e) {
  // Ignore
}

// Pre-warm the renderer
try {
  const warmElement = React.createElement(
    EmailComponents.Html,
    null,
    React.createElement(EmailComponents.Text, null, 'Email.Pro Warmed')
  );
  await render(warmElement);
} catch (e) {
  // Warmup silently
}

// Signal readiness to parent process
if (realSend) {
  realSend({ type: 'ready' });
}

// Handle render requests from parent process
ipcProcess.on('message', async (msg) => {
  if (!msg || typeof msg !== 'object') return;
  const { id, code, templates = [] } = msg;

  try {
    if (isRawHtml(code)) {
      if (realSend) realSend({ id, success: true, html: code });
      return;
    }

    const element = compileEmailElement(code, {
      emailComponents: EmailComponents,
      templates,
    });

    if (!element) {
      throw new Error('Could not find a valid React component in the provided code.');
    }

    const html = await render(element);
    if (realSend) realSend({ id, success: true, html });
  } catch (error) {
    const rawMessage = error && error.message ? error.message : String(error);
    const sanitized = rawMessage
      .replace(/\/(?:etc|proc|sys|var|usr|dev|app|root|home|tmp)\/[^\s:]+/gi, '[internal]')
      .replace(/node:[^\s:]+/g, '[internal]');

    if (realSend) realSend({ id, success: false, error: sanitized });
  }
});
