export const resetPasswordTemplate = `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Button, Hr, Tailwind } from '@react-email/components';

export default function ResetPasswordEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Reset your password — link expires in 10 minutes.</Preview>
        <Body className="bg-[#f4f4f5] font-sans">
          <Container className="mx-auto max-w-[560px] py-12 px-4">

            <Section className="mb-6 px-2">
              <Text className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 m-0">Acme Inc.</Text>
            </Section>

            <Section className="bg-white rounded-2xl px-10 py-12 mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Text className="text-2xl m-0">🔑</Text>
              </div>
              <Text className="text-xl font-bold text-gray-900 m-0 mb-3">Reset your password</Text>
              <Text className="text-sm text-gray-500 leading-6 m-0 mb-8">
                We received a request to reset the password for your account. Click the button below — this link expires in <strong style={{ color: '#111' }}>10 minutes</strong>.
              </Text>
              <Button
                href="https://example.com/reset"
                className="bg-gray-900 text-white text-sm font-semibold py-4 px-8 rounded-xl no-underline inline-block"
              >
                Reset Password →
              </Button>
              <Text className="text-xs text-gray-400 m-0 mt-8 leading-5">
                If you didn't request this, you can safely ignore this email. Your password will not change.
              </Text>
            </Section>

            <Section className="bg-white rounded-2xl px-8 py-6 mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <Text className="text-xs font-semibold text-gray-500 m-0 mb-2 uppercase tracking-wider">Or copy this link</Text>
              <Text className="text-xs font-mono text-gray-400 m-0 leading-5 break-all">
                https://example.com/reset/token-abc123xyz
              </Text>
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
