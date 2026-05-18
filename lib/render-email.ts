import { render } from '@react-email/render';
import React from 'react';
import * as EmailComponents from '@react-email/components';
import { transform } from 'sucrase';

/**
 * Transpiles and renders React Email code to HTML string.
 * This calls our server-side API route for reliable rendering.
 */
export async function exportToHTML(code: string, language?: string): Promise<string> {
  const trimmed = code.trim();
  
  if (language === 'html' || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    return code;
  }
  
  try {
    const response = await fetch('/api/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to render email');
    }

    const data = await response.json();
    return data.html;
  } catch (err) {
    console.error('Render error:', err);
    return `<div style="padding: 20px; color: #ef4444; font-family: sans-serif; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px;">
      <h3 style="margin-top: 0;">Render Error</h3>
      <p style="font-size: 14px;">The template could not be rendered as HTML.</p>
      <pre style="white-space: pre-wrap; font-size: 12px; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 4px;">${(err as Error).message}</pre>
    </div>`;
  }
}

/**
 * Dynamically converts code string to a React component.
 * Uses Sucrase for fast transpilation in the browser.
 */
export function renderEmailToReact(code: string): React.ComponentType {
  const trimmed = code.trim();
  
  // If it's plain HTML, just return a component that renders it
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    const RenderComponent = () => React.createElement('div', { dangerouslySetInnerHTML: { __html: code } });
    RenderComponent.displayName = 'RenderComponent';
    return RenderComponent;
  }

  try {
    // 1. Transpile TSX to JS using sucrase, including transforming imports
    const compiled = transform(code, {
      transforms: ['typescript', 'jsx', 'imports'],
      jsxRuntime: 'classic',
    }).code;

    // 2. Wrap in a function and provide a mock require
    // We'll use a simplified CommonJS implementation
    const factory = new Function('React', 'require', 'exports', compiled);
    
    const exports: any = {};
    const require = (path: string) => {
      if (path === 'react') return React;
      if (path === '@react-email/components') return EmailComponents;
      throw new Error(`Module not found: ${path}. Only 'react' and '@react-email/components' are supported.`);
    };
    
    factory(React, require, exports);
    
    // Look for the component in exports
    const Component = exports.default || Object.values(exports).find(v => typeof v === 'function');
    
    if (!Component) {
      throw new Error('Could not find a valid React component in the code. Ensure you have a default export.');
    }

    // Wrap the component to ensure it has a display name
    const FinalComponent = (props: any) => React.createElement(Component as any, props);
    FinalComponent.displayName = 'PreviewComponent';
    
    return FinalComponent;
  } catch (err) {
    console.warn('Transpilation failed:', err);
    // Fallback for when transpilation fails
    const FallbackComponent = () => React.createElement('div', { 
      className: "p-4 font-mono text-xs text-red-500 bg-red-50 rounded whitespace-pre-wrap border border-red-200"
    }, `Render Error: ${(err as Error).message}`);
    FallbackComponent.displayName = 'FallbackComponent';
    return FallbackComponent;
  }
}
