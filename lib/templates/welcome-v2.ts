export const welcomeV2Template = `
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import React from 'react';

export const WelcomeEmail = () => (
  <Tailwind>
    <Html>
      <Head />
      <Body className="bg-[#f8fafc] m-0 font-sans text-neutral-800 antialiased">
        <Preview>Welcome aboard — let's build the future of email together.</Preview>
        <Container className="mx-auto mt-16 w-full max-w-[580px] px-4">
          
          {/* Logo Brand Header */}
          <Section className="mb-8 px-2 flex justify-between items-center">
            <Img
              src="https://react.email/static/logo-black.png"
              alt="Resend Logo"
              width={24}
              height={24}
              className="block"
            />
            <Text className="m-0 text-xs font-black uppercase tracking-wider text-neutral-400">
              Resend Core
            </Text>
          </Section>

          {/* Primary Welcome Card */}
          <Section className="bg-white px-10 py-12 border border-neutral-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-6">
            <Section className="mb-8">
              <Img
                src="https://react.email/static/barebones-image.png"
                alt="Welcome Illustration"
                width={500}
                className="block mx-auto rounded-2xl w-full border border-neutral-100 shadow-2xs object-cover"
              />
            </Section>
            
            <Section className="text-left">
              <Text className="mt-0 mb-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                Welcome to Resend
              </Text>
              <Heading className="mt-0 mb-4 text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                Developer-first email platform.
              </Heading>
              <Text className="m-0 text-sm text-neutral-500 leading-relaxed">
                You've successfully created your account. With Resend, you can easily integrate responsive transactional emails, manage deliverability pipelines, and track performance analytics directly in your applications.
              </Text>
            </Section>

            <Section className="text-left mt-8">
              <Button
                href="https://resend.com"
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider px-8 py-4.5 rounded-xl no-underline inline-block shadow-sm"
              >
                Go to Dashboard
              </Button>
            </Section>
          </Section>

          {/* Secondary support link card */}
          <Section className="bg-white px-8 py-6 border border-neutral-200/60 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)] mb-8">
            <Text className="text-xs text-neutral-500 leading-relaxed m-0 text-center">
              Need assistance? Read our <Link href="https://resend.com/docs" className="text-indigo-600 font-bold underline">Documentation</Link> or join the global <Link href="#" className="text-indigo-600 font-bold underline">Developer Discord</Link>.
            </Text>
          </Section>

          {/* Minimalist Footer */}
          <Text className="text-center text-[10px] text-neutral-400 m-0 uppercase tracking-widest leading-relaxed">
            Resend Technologies Inc · 2261 Market St · San Francisco · CA
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default WelcomeEmail;
`.trim();
