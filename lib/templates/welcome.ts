export const welcomeTemplate = `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Button, Hr, Tailwind, Row, Column } from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Welcome to the future of development — your workspace is ready.</Preview>
        <Body className="bg-[#f8fafc] font-sans text-neutral-800 antialiased">
          <Container className="mx-auto max-w-[580px] py-16 px-4">
            
            {/* Header / Logo */}
            <Section className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 mb-3">
                <Text className="text-white text-xl font-bold m-0 font-mono">⚡</Text>
              </div>
              <Text className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 m-0">Linear Core</Text>
            </Section>

            {/* Main Greeting Card */}
            <Section className="bg-white rounded-3xl p-10 mb-6 border border-neutral-200/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
              <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wider m-0 mb-3">Workspace Activated</Text>
              <Text className="text-3xl font-bold tracking-tight text-neutral-900 m-0 mb-4 leading-tight">
                Welcome to Linear, Alex.
              </Text>
              <Text className="text-base text-neutral-500 leading-relaxed m-0 mb-8">
                Your high-performance workspace is ready. We've optimized your dashboard for maximum velocity. Here is how to get started in under two minutes.
              </Text>
              
              <Button
                href="https://linear.app/dashboard"
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider py-4.5 px-8 rounded-xl no-underline inline-block shadow-sm transition-all"
              >
                Launch Workspace →
              </Button>
            </Section>

            {/* Checklist Section */}
            <Section className="bg-white rounded-3xl p-8 mb-6 border border-neutral-200/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
              <Text className="text-xs font-black uppercase tracking-wider text-neutral-400 m-0 mb-6">Setup Checklist</Text>
              
              <Row className="mb-5">
                <Column className="w-8 align-top">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <Text className="text-emerald-600 text-[10px] font-bold m-0">✓</Text>
                  </div>
                </Column>
                <Column className="align-top pl-1">
                  <Text className="text-sm font-bold text-neutral-900 m-0 mb-0.5">Create your workspace</Text>
                  <Text className="text-xs text-neutral-500 m-0 leading-relaxed">Completed automatically during signup.</Text>
                </Column>
              </Row>

              <Row className="mb-5">
                <Column className="w-8 align-top">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                    <Text className="text-indigo-600 text-[10px] font-bold m-0">2</Text>
                  </div>
                </Column>
                <Column className="align-top pl-1">
                  <Text className="text-sm font-bold text-neutral-900 m-0 mb-0.5">Invite your core team</Text>
                  <Text className="text-xs text-neutral-500 m-0 leading-relaxed">Add collaborators to share issues, milestones, and cycles.</Text>
                </Column>
              </Row>

              <Row>
                <Column className="w-8 align-top">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                    <Text className="text-indigo-600 text-[10px] font-bold m-0">3</Text>
                  </div>
                </Column>
                <Column className="align-top pl-1">
                  <Text className="text-sm font-bold text-neutral-900 m-0 mb-0.5">Install the CLI utility</Text>
                  <Text className="text-xs text-neutral-500 m-0 leading-relaxed">Trigger actions and manage git branches straight from terminal.</Text>
                </Column>
              </Row>
            </Section>

            {/* CLI Developer Codeblock Card */}
            <Section className="bg-[#0b0f19] border border-neutral-900 rounded-3xl p-8 mb-8 text-left shadow-xl">
              <Text className="text-[10px] font-black uppercase tracking-widest text-indigo-400 m-0 mb-4">CLI Onboarding</Text>
              <div className="bg-[#030712] p-5 rounded-xl border border-gray-800 font-mono text-xs text-indigo-200">
                <span className="text-gray-500">$</span> npm install -g @linear/cli<br />
                <span className="text-gray-500">$</span> linear login<br />
                <span className="text-emerald-400">✓ Auth successful! Welcome Alex.</span>
              </div>
            </Section>

            {/* Footer */}
            <Hr className="border-neutral-200 m-0 mb-6" />
            <Text className="text-xs text-neutral-400 text-center m-0 leading-relaxed">
              Linear Core Ltd · 100 Pine St, San Francisco, CA 94111<br />
              <a href="#" style={{ color: '#6366f1', fontWeight: 'bold' }}>Unsubscribe</a> · <a href="#" style={{ color: '#6366f1', fontWeight: 'bold' }}>Privacy Policy</a>
            </Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();
