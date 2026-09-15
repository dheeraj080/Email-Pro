import React from 'react';
import * as EmailComponents from '@react-email/components';
import {
  isRawHtml,
  compileEmailElement,
  evaluateTemplate,
  extractComponent,
  transpileCode as transpileJSX,
} from './template-compiler';

export { transpileJSX };

function getClientMockedComponents() {
  const mocked = {
    ...EmailComponents,
    Html: ({ children }: any) => React.createElement(React.Fragment, null, children),
    Head: ({ children }: any) => React.createElement(React.Fragment, null, children),
    Body: ({ children, className, style }: any) => React.createElement('div', { 
      className: `email-body-preview ${className || ''}`,
      style: { width: '100%', minHeight: '100%', ...style }
    }, children),
    Preview: () => null,
    Tailwind: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };

  return new Proxy(mocked, {
    get: (target, prop) => {
      if (prop in target) return (target as any)[prop];
      return (EmailComponents as any)[prop];
    }
  });
}

export function compileTemplate(code: string, templates: any[] = []): any {
  try {
    const mockedComponents = getClientMockedComponents();
    const result = evaluateTemplate(code, {
      emailComponents: mockedComponents,
      templates,
    });
    return extractComponent(result) || {};
  } catch (error) {
    console.error('Failed to compile dependency:', error);
    return {};
  }
}

export function renderEmailToReact(code: string, templates: any[] = []): React.ReactElement | null {
  try {
    // If it looks like raw HTML, don't try to transpile it as React
    if (isRawHtml(code)) {
      return React.createElement('div', { 
        dangerouslySetInnerHTML: { __html: code },
        className: 'legacy-html-preview'
      });
    }

    const mockedComponents = getClientMockedComponents();
    return compileEmailElement(code, {
      emailComponents: mockedComponents,
      templates,
    });
  } catch (error) {
    console.error('Render error:', error);
    return null;
  }
}

const renderCache = new Map<string, string>();

export async function exportToHTML(code: string, language?: string, templateId?: string, templates: any[] = []): Promise<string> {
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
      body: JSON.stringify({ code, language, templates }),
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
