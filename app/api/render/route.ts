import { render } from '@react-email/render';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import * as EmailComponents from '@react-email/components';
import { transform } from 'sucrase';

const serverRenderCache = new Map<string, string>();

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Email rendering service is active' });
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Normalize code for better cache hits (trim whitespace)
    const normalizedCode = code.trim();

    // Check cache
    if (serverRenderCache.has(normalizedCode)) {
      return NextResponse.json({ html: serverRenderCache.get(normalizedCode) });
    }

    // Transpile the code
    const transpiledCode = transform(normalizedCode, {
      transforms: ['jsx', 'typescript', 'imports'],
      jsxRuntime: 'classic',
    }).code;

    const wrappedCode = `
      var exports = {};
      var module = { exports: exports };
      ${transpiledCode}
      return module.exports.default || module.exports;
    `;

    // Create a local scope for components
    const scope = {
      React,
      ...EmailComponents,
      process: {
        env: {
          VERCEL_URL: process.env.VERCEL_URL || '',
        }
      },
      require: (name: string) => {
        if (name === 'react') return React;
        if (name === '@react-email/components' || name === 'react-email') return EmailComponents;
        // Mock local imports for the editor
        if (name.startsWith('./') || name.startsWith('../')) {
          return {
            barebonesBoxedTailwindConfig: {},
            BarebonesFonts: () => null,
          };
        }
        return {};
      }
    };

    const keys = Object.keys(scope);
    const values = Object.values(scope);
    const renderFn = new Function(...keys, wrappedCode);
    
    let result = renderFn(...values);
    
    // The result from wrappedCode is module.exports (or module.exports.default || module.exports)
    // Let's ensure we get the actual component
    let Component = result;

    if (Component && typeof Component === 'object' && !React.isValidElement(Component)) {
      if (Component.default) {
        Component = Component.default;
      } else {
        // Find something that looks like a component
        const componentKey = Object.keys(Component).find(key => {
          if (key === '__esModule') return false;
          const val = Component[key];
          return typeof val === 'function' || (val && typeof val === 'object' && (val.$$typeof || val.render || val.type));
        });
        if (componentKey) {
          Component = Component[componentKey];
        }
      }
    }
    
    // If we still have an object that isn't an element, it might be the exports object with no identifiable component
    if (Component && typeof Component === 'object' && !React.isValidElement(Component) && Object.keys(Component).length === 0) {
      throw new Error('No exports found in the code. Make sure to "export default" your component.');
    }

    if (typeof Component === 'function' || (Component && typeof Component === 'object' && !React.isValidElement(Component))) {
      try {
        Component = React.createElement(Component as any);
      } catch (e) {
        // Fallback or ignore if it's already an element
      }
    }

    if (!Component || (typeof Component === 'object' && !React.isValidElement(Component))) {
       throw new Error('Could not find a valid React component to render. Ensure you are exporting a component.');
    }

    const html = await render(Component as React.ReactElement);

    // Update cache
    serverRenderCache.set(normalizedCode, html);
    if (serverRenderCache.size > 100) {
      const firstKey = serverRenderCache.keys().next().value;
      if (firstKey) serverRenderCache.delete(firstKey);
    }

    return NextResponse.json({ html });
  } catch (error: any) {
    console.error('API Render Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
