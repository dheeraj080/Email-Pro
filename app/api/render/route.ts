import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import * as EmailComponents from '@react-email/components';
import React from 'react';
import { transform } from 'sucrase';

export async function POST(req: Request) {
  try {
    const { code, language, templates = [] } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (language === 'html' || code.trim().startsWith('<!DOCTYPE') || code.trim().startsWith('<html')) {
      return NextResponse.json({ html: code });
    }

    // Transpile JSX/TSX
    const transpiledCode = transform(code, {
      transforms: ['jsx', 'typescript', 'imports'],
      jsxRuntime: 'classic',
    }).code;

    // Evaluate the code to get the component
    // We wrap it in a function that provides the necessary context
    const wrappedCode = `
      var React = arguments[0];
      var EmailComponents = arguments[1];
      var templates = arguments[2] || [];
      var transformFn = arguments[3];
      
      var moduleCache = {};
      
      var compileTemplate = (depCode) => {
        try {
          const transpiled = transformFn(depCode, {
            transforms: ['jsx', 'typescript', 'imports'],
            jsxRuntime: 'classic',
          }).code;
          
          var exportsObj = {};
          var moduleObj = { exports: exportsObj };
          
          var depFn = new Function('React', 'EmailComponents', 'require', 'exports', 'module', transpiled + '; return module.exports.default || module.exports;');
          return depFn(React, EmailComponents, require, exportsObj, moduleObj);
        } catch (err) {
          console.error('Failed to compile sub-module:', err);
          return {};
        }
      };

      var require = (name) => {
        if (name === 'react') return React;
        if (name === '@react-email/components' || name === 'react-email') return EmailComponents;
        
        // Resolve relative imports from the workspace templates registry
        if (name.startsWith('./') || name.startsWith('../')) {
          const cleanName = name.replace(/^\\.\\/?/, '').replace(/^\\.\\.\\/?/, '').replace(/\\.(ts|tsx|js|jsx)$/, '');
          const template = templates.find(t => 
            t.id === cleanName || 
            t.name?.toLowerCase() === cleanName.toLowerCase()
          );
          
          if (template) {
            if (moduleCache[template.id]) {
              return moduleCache[template.id];
            }
            const result = compileTemplate(template.code);
            moduleCache[template.id] = result;
            return result;
          }
          
          // Pre-styled high-fidelity Barebones fallback configuration if not present
          if (name.includes('theme') || name.includes('fonts')) {
            return {
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
                    }
                  }
                }
              },
              BarebonesFonts: () => React.createElement('style', {
                dangerouslySetInnerHTML: {
                  __html: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); body { font-family: 'Inter', sans-serif !important; }"
                }
              })
            };
          }
        }
        return {};
      };
      
      var process = {
        env: {
          VERCEL_URL: 'react.email'
        }
      };
      
      var exports = {};
      var module = { exports: exports };
      
      // Wrap in an IIFE to provide clear scope and avoid redeclaration errors
      // with variables defined in the outer scope.
      (function(React, EmailComponents, require, exports, module, process) {
        ${transpiledCode}
      })(React, EmailComponents, require, exports, module, process);
      
      return module.exports.default || module.exports;
    `;

    const getComponent = new Function('React', 'EmailComponents', 'templates', 'transformFn', wrappedCode);
    let Component = getComponent(React, EmailComponents, templates, transform);

    // Handle extraction from exports object if it's not the component itself
    if (Component && typeof Component === 'object' && !React.isValidElement(Component)) {
      if (Component.default) {
        Component = Component.default;
      } else {
        const potentialKey = Object.keys(Component).find(key => typeof Component[key] === 'function');
        if (potentialKey) Component = Component[potentialKey];
      }
    }

    // Ensure it's a valid React element for rendering
    let element;
    if (React.isValidElement(Component)) {
      element = Component;
    } else if (typeof Component === 'function') {
      element = React.createElement(Component);
    } else {
      throw new Error('Could not find a valid React component in the provided code.');
    }

    const html = await render(element);
    return NextResponse.json({ html });
  } catch (error: any) {
    console.error('Render error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to render email template' },
      { status: 500 }
    );
  }
}
