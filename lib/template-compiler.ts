import React from 'react';
import { transform } from 'sucrase';

export interface CompileOptions {
  emailComponents: any;
  templates?: any[];
}

/**
 * Checks if a code snippet represents raw HTML rather than JSX/TSX.
 */
export function isRawHtml(code: string): boolean {
  const trimmed = code.trim();
  return trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html');
}

/**
 * Transforms JSX/TypeScript/ES imports into CJS-compatible JavaScript.
 */
export function transpileCode(code: string): string {
  return transform(code, {
    transforms: ['jsx', 'typescript', 'imports'],
    jsxRuntime: 'classic',
  }).code;
}

/**
 * Fallback theme configuration for templates referencing barebones theme/fonts.
 */
export const BAREBONES_FALLBACK_THEME = {
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

/**
 * Resolves relative imports against the workspace templates collection.
 */
export function resolveTemplateImport(
  name: string,
  templates: any[] = []
): any | null {
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

/**
 * Extracts a React component from evaluated CJS module exports.
 */
export function extractComponent(exportsValue: any): any {
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

/**
 * Converts a component definition or element into a valid React element.
 */
export function toReactElement(Component: any): React.ReactElement | null {
  if (React.isValidElement(Component)) {
    return Component;
  }
  if (typeof Component === 'function') {
    return React.createElement(Component);
  }
  return null;
}

/**
 * Evaluates template code using CJS evaluation in an isolated scope.
 */
export function evaluateTemplate(
  code: string,
  options: CompileOptions,
  moduleCache: Map<string, any> = new Map()
): any {
  const transpiledCode = transpileCode(code);

  const customRequire = (name: string): any => {
    if (name === 'react') {
      return React;
    }
    if (name === '@react-email/components' || name === 'react-email') {
      return options.emailComponents;
    }
    if (name.startsWith('./') || name.startsWith('../')) {
      const template = resolveTemplateImport(name, options.templates || []);
      if (template) {
        if (moduleCache.has(template.id)) {
          return moduleCache.get(template.id);
        }
        const compiledDep = evaluateTemplate(template.code, options, moduleCache);
        moduleCache.set(template.id, compiledDep);
        return compiledDep;
      }
      if (name.includes('theme') || name.includes('fonts')) {
        return BAREBONES_FALLBACK_THEME;
      }
    }
    return {};
  };

  const processMock = {
    env: {
      VERCEL_URL: 'react.email',
    },
  };

  const exportsObj: Record<string, any> = {};
  const moduleObj = { exports: exportsObj };

  // CommonJS wrapper function using new Function
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
  const result = runner(
    React,
    options.emailComponents,
    customRequire,
    exportsObj,
    moduleObj,
    processMock
  );

  return result;
}

/**
 * Compiles template code and returns a ready-to-render ReactElement, or null on failure.
 */
export function compileEmailElement(
  code: string,
  options: CompileOptions
): React.ReactElement | null {
  const exportsResult = evaluateTemplate(code, options);
  const Component = extractComponent(exportsResult);
  return toReactElement(Component);
}
