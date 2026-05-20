export const welcomeTemplate = `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Button, Hr, Tailwind } from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Welcome — you're all set.</Preview>
        <Body className="bg-[#f4f4f5] font-sans">
          <Container className="mx-auto max-w-[600px] py-12 px-4">

            <Section className="mb-8 px-2">
              <Text className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 m-0">Acme Inc.</Text>
            </Section>

            <Section className="bg-white rounded-2xl px-10 py-12 mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <Text className="text-3xl m-0 mb-5">👋</Text>
              <Text className="text-2xl font-bold text-gray-900 m-0 mb-3 leading-tight">
                Welcome aboard, Alex.
              </Text>
              <Text className="text-base text-gray-500 leading-7 m-0 mb-8">
                Your account is ready. Explore your dashboard, set up your workspace, and reach out anytime if you need help.
              </Text>
              <Button
                href="https://example.com/dashboard"
                className="bg-gray-900 text-white text-sm font-semibold py-4 px-8 rounded-xl no-underline inline-block"
              >
                Open Dashboard →
              </Button>
            </Section>

            <Section className="mb-6">
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td style={{ padding: '4px 4px 4px 0', width: '50%', verticalAlign: 'top' }}>
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                      <Text className="text-lg m-0 mb-2">⚡</Text>
                      <Text className="text-sm font-bold text-gray-900 m-0 mb-1">Quick Setup</Text>
                      <Text className="text-xs text-gray-500 m-0 leading-5">Up and running in under 2 minutes.</Text>
                    </div>
                  </td>
                  <td style={{ padding: '4px 0 4px 4px', width: '50%', verticalAlign: 'top' }}>
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                      <Text className="text-lg m-0 mb-2">🔒</Text>
                      <Text className="text-sm font-bold text-gray-900 m-0 mb-1">Secure by Default</Text>
                      <Text className="text-xs text-gray-500 m-0 leading-5">Enterprise-grade security baked in.</Text>
                    </div>
                  </td>
                </tr>
              </table>
            </Section>

            <Hr className="border-gray-200 m-0 mb-6" />
            <Text className="text-xs text-gray-400 text-center m-0 leading-6">
              Acme Inc. · 123 Market St, San Francisco, CA<br />
              <a href="#" style={{ color: '#9ca3af' }}>Unsubscribe</a> · <a href="#" style={{ color: '#9ca3af' }}>Privacy</a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();
