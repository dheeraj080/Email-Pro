'use client';

import { useState } from 'react';
import EmailEditor from '@/components/email-editor';
import LandingPage from '@/components/landing-page';
import { ErrorBoundary } from '@/components/error-boundary';
import { TEMPLATES } from '@/lib/templates';

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState<typeof TEMPLATES[0] | undefined>(undefined);

  return (
    <ErrorBoundary name="Application">
      <main>
        {!showEditor ? (
          <LandingPage 
            onStart={() => setShowEditor(true)} 
            onSelectTemplate={(template) => setInitialTemplate(template)}
          />
        ) : (
          <EmailEditor 
            onBack={() => {
              setShowEditor(false);
              setInitialTemplate(undefined);
            }} 
            initialTemplate={initialTemplate}
          />
        )}
      </main>
    </ErrorBoundary>
  );
}
