import React from 'react';
import * as EmailComponents from '@react-email/components';
import { transform } from 'sucrase';

export function transpileJSX(code: string): string {
  try {
    const transpiledCode = transform(code, {
      transforms: ['jsx', 'typescript', 'imports'],
      jsxRuntime: 'classic',
    }).code;

    const wrappedCode = `
      var exports = {};
      var module = { exports: exports };
      ${transpiledCode}
      return module.exports.default || module.exports;
    `;

    return wrappedCode;
  } catch (error) {
    console.error('Transpilation error:', error);
    throw error;
  }
}

export function renderEmailToReact(code: string): React.ReactElement | null {
  try {
    const transpiled = transpileJSX(code);
    
    // Create a local scope for components
    const scope = {
      React,
      ...EmailComponents,
      process: {
        env: {
          VERCEL_URL: '',
        }
      },
      require: (name: string) => {
        if (name === 'react') return React;
        if (name === '@react-email/components' || name === 'react-email') return EmailComponents;
        // Mock local imports for the editor
        if (name.startsWith('./') || name.startsWith('../')) {
          console.warn(`Local import "${name}" is not supported in the live editor. Returning empty module.`);
          return {
            barebonesBoxedTailwindConfig: {},
            BarebonesFonts: () => null,
          };
        }
        return {};
      }
    };

    // Use Function constructor to evaluate code safely in browser
    const keys = Object.keys(scope);
    const values = Object.values(scope);
    const renderFn = new Function(...keys, transpiled);
    
    let result = renderFn(...values);
    let Component = result;

    // Handle extraction from exports object
    if (Component && typeof Component === 'object' && !React.isValidElement(Component)) {
      if ((Component as any).default) {
        Component = (Component as any).default;
      } else {
        // Find something that looks like a component
        const componentKey = Object.keys(Component).find(key => {
          if (key === '__esModule') return false;
          const val = (Component as any)[key];
          return typeof val === 'function' || (val && typeof val === 'object' && (val.$$typeof || val.render || val.type));
        });
        if (componentKey) {
          Component = (Component as any)[componentKey];
        }
      }
    }
    
    if (typeof Component === 'function' || (Component && typeof Component === 'object' && !React.isValidElement(Component))) {
      try {
        return React.createElement(Component as any);
      } catch (e) {
        // Already an element or invalid
      }
    }
    
    if (Component && typeof Component === 'object' && !React.isValidElement(Component) && Object.keys(Component).length === 0) {
      console.warn('Rendered result is an empty object, possibly failed to find export');
      return null;
    }

    return Component;
  } catch (error) {
    console.error('Render error:', error);
    return null;
  }
}

const renderCache = new Map<string, string>();

export async function exportToHTML(code: string): Promise<string> {
  if (renderCache.has(code)) {
    return renderCache.get(code)!;
  }

  try {
    const response = await fetch('/api/render', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ code }),
    });

    const text = await response.text();
    
    if (!response.ok) {
      let errorMessage = 'Failed to render email';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(text);
    renderCache.set(code, data.html);
    
    // Simple cache eviction to prevent memory leak
    if (renderCache.size > 50) {
      const firstKey = renderCache.keys().next().value;
      if (firstKey) renderCache.delete(firstKey);
    }

    return data.html;
  } catch (error: any) {
    console.error('Export error (detailed):', error);
    if (error.message === 'Failed to fetch') {
      throw new Error('Connection refused. Please check if the development server is running.');
    }
    throw error;
  }
}
