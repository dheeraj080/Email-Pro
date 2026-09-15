'use client';

import { useState, useEffect } from 'react';
import EmailEditor from '@/components/email-editor';
import LandingPage from '@/components/landing-page';
import { ErrorBoundary } from '@/components/error-boundary';
import { TEMPLATES } from '@/lib/templates';
import { Template } from '@/lib/types';

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState<Template | undefined>(undefined);

  // Check query parameters on mount to support loading specific templates directly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const templateId = params.get('template');
      const shouldStart = params.get('start');

      if (templateId) {
        const selectedTmpl = TEMPLATES.find(t => t.id === templateId);
        if (selectedTmpl) {
          setInitialTemplate(selectedTmpl);
          setShowEditor(true);
        }
      } else if (shouldStart === 'true') {
        setShowEditor(true);
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <main className="min-h-screen">
        {!showEditor ? (
          <LandingPage 
            onStart={() => setShowEditor(true)} 
            onSelectTemplate={(template) => {
              setInitialTemplate(template);
              setShowEditor(true);
            }}
          />
        ) : (
          <EmailEditor 
            onBack={() => {
              setShowEditor(false);
              setInitialTemplate(undefined);
              // Clean up query parameters on return
              if (typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }} 
            initialTemplate={initialTemplate}
          />
        )}
      </main>
    </ErrorBoundary>
  );
}

