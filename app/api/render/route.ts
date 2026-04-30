import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import * as EmailComponents from '@react-email/components';
import React from 'react';
import { transform } from 'sucrase';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (language === 'html') {
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
      var require = (name) => {
        if (name === 'react') return React;
        if (name === '@react-email/components' || name === 'react-email') return EmailComponents;
        return {};
      };
      var exports = {};
      var module = { exports: exports };
      
      // Wrap in an IIFE to provide clear scope and avoid redeclaration errors
      // with variables defined in the outer scope.
      (function(React, EmailComponents, require, exports, module) {
        ${transpiledCode}
      })(React, EmailComponents, require, exports, module);
      
      return module.exports.default || module.exports;
    `;

    const getComponent = new Function('React', 'EmailComponents', wrappedCode);
    let Component = getComponent(React, EmailComponents);

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
