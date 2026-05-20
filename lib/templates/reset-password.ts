export const resetPasswordTemplate = `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Button, Hr, Tailwind } from '@react-email/components';

export default function ResetPasswordEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>🔒 Reset your password — security verification code inside.</Preview>
        <Body className="bg-[#FAF9F6] font-sans antialiased text-neutral-800">
          <Container className="mx-auto max-w-[500px] py-16 px-4">

            {/* Logo bar */}
            <Section className="mb-10 text-center">
              <div className="inline-block w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center shadow-sm">
                <Text className="text-white font-bold text-xs m-0">⚡</Text>
              </div>
            </Section>

            {/* Main verification card */}
            <Section className="bg-white rounded-3xl p-10 mb-6 border border-neutral-200/50 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)]">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <Text className="text-2xl m-0">🔑</Text>
              </div>
              
              <Text className="text-2xl font-black tracking-tight text-neutral-900 m-0 mb-3">Reset your password</Text>
              <Text className="text-sm text-neutral-500 leading-relaxed m-0 mb-8">
                We received a request to authorize a password change for your account. If you did not trigger this request, you can safely ignore this warning.
              </Text>

              {/* Unique PIN number container */}
              <Section className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100 mb-8">
                <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-400 m-0 mb-2">Temporary Verification PIN</Text>
                <Text className="text-3xl font-mono font-black text-rose-500 tracking-[0.25em] m-0">842-105</Text>
                <Text className="text-[10px] text-neutral-400 m-0 mt-2">Expires in 10 minutes · One-time use only</Text>
              </Section>

              <Button
                href="https://example.com/reset-confirm"
                className="w-full text-center bg-neutral-900 hover:bg-neutral-850 text-white text-xs font-black uppercase tracking-wider py-4.5 rounded-xl no-underline inline-block shadow-sm transition-all"
              >
                Confirm Verification Code →
              </Button>
            </Section>

            {/* Security Notice */}
            <Section className="bg-white rounded-2xl p-6 border border-neutral-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.01)] text-left mb-8">
              <Text className="text-[10px] font-bold text-rose-600 m-0 mb-1.5 uppercase tracking-wider">🔒 Security Advisory</Text>
              <Text className="text-xs text-neutral-500 leading-relaxed m-0">
                Acme employees will never call or message you requesting this PIN code. Never share this code with anyone under any circumstances.
              </Text>
            </Section>

            <Hr className="border-neutral-200 m-0 mb-6" />
            <Text className="text-xs text-neutral-400 text-center m-0 leading-relaxed">
              Acme Inc · Security Operations Center<br />
              123 Market St, Suite 500 · San Francisco, CA 94103
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();
