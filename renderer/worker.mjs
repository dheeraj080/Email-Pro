import { register } from 'node:module';
import { render } from '@react-email/render';
import * as EmailComponents from '@react-email/components';
import React from 'react';
import { transform } from 'sucrase';

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

// Strip network APIs and dangerous globals inside the worker
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

function isRawHtml(code) {
  const trimmed = (code || '').trim();
  return trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html');
}

function transpileCode(code) {
  return transform(code, {
    transforms: ['jsx', 'typescript', 'imports'],
    jsxRuntime: 'classic',
  }).code;
}

const BAREBONES_FALLBACK_THEME = {
  barebonesBoxedTailwindConfig: {
    theme: {
      extend: {
        colors: {
          bg: '#ffffff',
          'bg-2': '#f4f4f5',
          fg: '#18181b',
          'fg-2': '#71717a',
          'fg-3': '#a1a1aa',
          'fg-inverted': '#ffffff',
        },
        fontSize: {
          'font-11': '11px',
          'font-13': '13px',
          'font-16': '16px',
          'font-28': '28px',
        },
      },
    },
  },
  BarebonesFonts: () =>
    React.createElement('style', {
      dangerouslySetInnerHTML: {
        __html:
          "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); body { font-family: 'Inter', sans-serif !important; }",
      },
    }),
};

function resolveTemplateImport(name, templates = []) {
  if (!name.startsWith('./') && !name.startsWith('../')) {
    return null;
  }
  const cleanName = name
    .replace(/^\.\/?/, '')
    .replace(/^\.\.\/?/, '')
    .replace(/\.(ts|tsx|js|jsx)$/, '');

  const template = templates.find(
    (t) =>
      t.id === cleanName || t.name?.toLowerCase() === cleanName.toLowerCase()
  );

  return template || null;
}

function extractComponent(exportsValue) {
  let Component = exportsValue;
  if (Component && typeof Component === 'object' && !React.isValidElement(Component)) {
    if (Component.default) {
      Component = Component.default;
    } else {
      const potentialKey = Object.keys(Component).find((key) => {
        if (key === '__esModule') return false;
        const val = Component[key];
        return (
          typeof val === 'function' ||
          (val && typeof val === 'object' && (val.$$typeof || val.render || val.type))
        );
      });
      if (potentialKey) {
        Component = Component[potentialKey];
      }
    }
  }
  return Component;
}

function toReactElement(Component) {
  if (React.isValidElement(Component)) {
    return Component;
  }
  if (typeof Component === 'function') {
    return React.createElement(Component);
  }
  return null;
}

const FORBIDDEN_MODULES = new Set([
  'fs',
  'child_process',
  'path',
  'os',
  'net',
  'http',
  'https',
  'crypto',
  'cluster',
  'dgram',
  'dns',
  'events',
  'http2',
  'inspector',
  'module',
  'process',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'undici',
  'url',
  'util',
  'v8',
  'vm',
  'wasi',
  'worker_threads',
  'zlib',
]);

function evaluateTemplate(
  code,
  templates = [],
  moduleCache = new Map(),
  depth = 0
) {
  if (depth > 10) {
    throw new Error('Template dependency depth exceeded maximum limit (10).');
  }
  if (code.length > 500_000) {
    throw new Error('Template code exceeds maximum size limit (500KB).');
  }

  const transpiledCode = transpileCode(code);

  const customRequire = (name) => {
    if (name === 'react') {
      return React;
    }
    if (name === '@react-email/components' || name === 'react-email') {
      return EmailComponents;
    }
    if (FORBIDDEN_MODULES.has(name) || name.startsWith('node:')) {
      throw new Error(`Disallowed module import: "${name}"`);
    }
    if (name.startsWith('./') || name.startsWith('../')) {
      const template = resolveTemplateImport(name, templates);
      if (template) {
        if (moduleCache.has(template.id)) {
          return moduleCache.get(template.id);
        }
        const compiledDep = evaluateTemplate(
          template.code,
          templates,
          moduleCache,
          depth + 1
        );
        moduleCache.set(template.id, compiledDep);
        return compiledDep;
      }
      if (name.includes('theme') || name.includes('fonts')) {
        return BAREBONES_FALLBACK_THEME;
      }
    }
    return {};
  };

  const processMock = Object.freeze({
    env: Object.freeze({
      VERCEL_URL: 'react.email',
      NODE_ENV: 'production',
    }),
    platform: 'email-pro',
    pid: -1,
  });

  const exportsObj = {};
  const moduleObj = { exports: exportsObj };

  const wrappedCode = `
    var React = arguments[0];
    var EmailComponents = arguments[1];
    var require = arguments[2];
    var exports = arguments[3];
    var module = arguments[4];
    var process = arguments[5];

    (function(React, EmailComponents, require, exports, module, process) {
      ${transpiledCode}
    })(React, EmailComponents, require, exports, module, process);

    return module.exports;
  `;

  const runner = new Function(wrappedCode);
  return runner(
    React,
    EmailComponents,
    customRequire,
    exportsObj,
    moduleObj,
    processMock
  );
}

function compileEmailElement(code, templates = []) {
  const exportsResult = evaluateTemplate(code, templates);
  const Component = extractComponent(exportsResult);
  return toReactElement(Component);
}

// Single-use execution: Listen for exactly one message, render, send result, then exit.
ipcProcess.once('message', async (msg) => {
  if (!msg || typeof msg !== 'object') {
    ipcProcess.exit(1);
    return;
  }
  const { id, code, templates = [] } = msg;

  try {
    if (isRawHtml(code)) {
      if (realSend) realSend({ id, success: true, html: code });
      ipcProcess.exit(0);
      return;
    }

    const element = compileEmailElement(code, templates);
    if (!element) {
      throw new Error('Could not find a valid React component in the provided code.');
    }

    const html = await render(element);
    if (realSend) realSend({ id, success: true, html });
    ipcProcess.exit(0);
  } catch (error) {
    const rawMessage = error && error.message ? error.message : String(error);
    const sanitized = rawMessage
      .replace(/\/(?:etc|proc|sys|var|usr|dev|app|root|home|tmp)\/[^\s:]+/gi, '[internal]')
      .replace(/node:[^\s:]+/g, '[internal]');

    if (realSend) realSend({ id, success: false, error: sanitized });
    ipcProcess.exit(1);
  }
});

// Signal readiness to dispatcher
if (realSend) {
  realSend({ type: 'ready' });
}
