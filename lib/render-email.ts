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
    // If it looks like raw HTML, don't try to transpile it as React
    if (code.trim().startsWith('<!DOCTYPE') || code.trim().startsWith('<html')) {
      return React.createElement('div', { 
        dangerouslySetInnerHTML: { __html: code },
        className: 'legacy-html-preview'
      });
    }

    const transpiled = transpileJSX(code);
    
    const mockedComponents = {
      ...EmailComponents,
      Html: ({ children }: any) => React.createElement(React.Fragment, null, children),
      Head: ({ children }: any) => React.createElement(React.Fragment, null, children),
      Body: ({ children }: any) => React.createElement('div', { 
        className: 'email-body-preview',
        style: { width: '100%', minHeight: '100%', backgroundColor: '#ffffff' }
      }, children),
      Preview: () => null,
      Tailwind: ({ children }: any) => React.createElement(React.Fragment, null, children),
    };

    // Create a local scope for components
    const scope = {
      React,
      ...mockedComponents,
      // Handle cases where people might use lowercase tags if transpiler allows
      html: ({ children }: any) => React.createElement(React.Fragment, null, children),
      body: ({ children }: any) => React.createElement('div', null, children),
      head: () => null,
      process: {
        env: {
          VERCEL_URL: '',
        }
      },
      require: (name: string) => {
        if (name === 'react') return React;
        if (name === '@react-email/components' || name === 'react-email') {
          return new Proxy(mockedComponents, {
            get: (target, prop) => {
              if (prop in target) return (target as any)[prop];
              return (EmailComponents as any)[prop];
            }
          });
        }
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

export async function exportToHTML(code: string, language?: string, templateId?: string): Promise<string> {
  const cacheKey = `${language || 'typescript'}:${code}`;
  if (renderCache.has(cacheKey)) {
    return renderCache.get(cacheKey)!;
  }

  // Check localStorage for static preset templates
  if (templateId && typeof window !== 'undefined') {
    const localKey = `email_pro_preview_${templateId}_${code.length}`;
    try {
      const cachedHTML = localStorage.getItem(localKey);
      if (cachedHTML) {
        renderCache.set(cacheKey, cachedHTML);
        return cachedHTML;
      }
    } catch (e) {
      console.warn('Failed to read preview from localStorage:', e);
    }
  }

  try {
    const response = await fetch('/api/render', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ code, language }),
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
    
    // Save to localStorage for persistence across app loads
    if (templateId && typeof window !== 'undefined') {
      const localKey = `email_pro_preview_${templateId}_${code.length}`;
      try {
        localStorage.setItem(localKey, data.html);
      } catch (e) {
        console.warn('Failed to save preview to localStorage:', e);
      }
    }

    renderCache.set(cacheKey, data.html);
    
    // Simple cache eviction to prevent memory leak
    if (renderCache.size > 50) {
      const firstKey = renderCache.keys().next().value;
      if (firstKey) renderCache.delete(firstKey);
    }

    return data.html;
  } catch (error: any) {
    console.error('Export error (detailed):', error);
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      throw new Error('Network error: Could not reach the render API. Please ensure the development server is running and reachable.');
    }
    throw error;
  }
}
