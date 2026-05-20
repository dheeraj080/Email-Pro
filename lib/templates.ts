import { 
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Column,
  Row,
  Tailwind
} from '@react-email/components';
import { Template } from './types';

export const DEFAULT_TEMPLATE = `
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

export const TEMPLATES: Template[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    code: DEFAULT_TEMPLATE,
    language: 'typescript'
  },
  {
    id: 'reset-password',
    name: 'Reset Password',
    code: `
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
`.trim(),
    language: 'typescript'
  },
  {
    id: 'receipt',
    name: 'Order Receipt',
    code: `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Hr, Row, Column, Tailwind } from '@react-email/components';

export default function ReceiptEmail() {
  const lineItems = [
    { name: 'Minimalist Watch', qty: 1, price: '$120.00' },
    { name: 'Premium Leather Strap', qty: 1, price: '$45.00' },
  ];
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Order confirmed — #ORD-12345</Preview>
        <Body className="bg-[#f4f4f5] font-sans">
          <Container className="mx-auto max-w-[600px] py-12 px-4">

            <Section className="mb-6 px-2">
              <Text className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 m-0">Replenish Store</Text>
            </Section>

            {/* Header card */}
            <Section className="bg-gray-900 rounded-2xl px-10 py-10 mb-4 text-center">
              <Text className="text-2xl m-0 mb-3">📦</Text>
              <Text className="text-white text-xl font-bold m-0 mb-2">Order Confirmed</Text>
              <Text className="text-gray-400 text-sm m-0">Order #ORD-12345 · Oct 20, 2026</Text>
            </Section>

            {/* Line items */}
            <Section className="bg-white rounded-2xl px-8 py-8 mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <Text className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 m-0 mb-6">Order Summary</Text>
              {lineItems.map((item) => (
                <Row key={item.name} style={{ borderBottom: '1px solid #f4f4f5', paddingBottom: '16px', marginBottom: '16px' }}>
                  <Column>
                    <Text className="text-sm font-semibold text-gray-900 m-0">{item.name}</Text>
                    <Text className="text-xs text-gray-400 m-0">Qty: {item.qty}</Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-sm font-mono font-semibold text-gray-900 m-0">{item.price}</Text>
                  </Column>
                </Row>
              ))}
              <Hr className="border-gray-100 my-4" />
              <Row>
                <Column><Text className="text-sm text-gray-500 m-0">Subtotal</Text></Column>
                <Column align="right"><Text className="text-sm font-mono text-gray-700 m-0">$165.00</Text></Column>
              </Row>
              <Row>
                <Column><Text className="text-sm text-gray-500 m-0">Shipping</Text></Column>
                <Column align="right"><Text className="text-sm font-mono text-gray-700 m-0">Free</Text></Column>
              </Row>
              <Hr className="border-gray-100 my-4" />
              <Row>
                <Column><Text className="text-base font-bold text-gray-900 m-0">Total</Text></Column>
                <Column align="right"><Text className="text-base font-bold font-mono text-gray-900 m-0">$165.00</Text></Column>
              </Row>
            </Section>

            {/* Shipping info */}
            <Section className="bg-white rounded-2xl px-8 py-6 mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <Text className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 m-0 mb-3">Shipping To</Text>
              <Text className="text-sm text-gray-700 m-0 leading-6">
                Alex Johnson<br />
                42 Main Street, Apt 3B<br />
                New York, NY 10001
              </Text>
            </Section>

            <Hr className="border-gray-200 m-0 mb-6" />
            <Text className="text-xs text-gray-400 text-center m-0 leading-6">
              Replenish Store · Questions? <a href="#" style={{ color: '#9ca3af' }}>Contact Support</a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim(),
    language: 'typescript'
  },
  {
    id: 'newsletter',
    name: 'Weekly Newsletter',
    code: `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Link, Img, Hr, Tailwind } from '@react-email/components';

export default function NewsletterEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>The Weekly Dispatch — Issue #42</Preview>
        <Body className="bg-[#f4f4f5] font-sans">
          <Container className="mx-auto max-w-[600px] py-12 px-4">

            {/* Header */}
            <Section className="bg-gray-900 rounded-2xl overflow-hidden mb-4">
              <Section className="px-10 py-10">
                <Text className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400 m-0 mb-3">Issue #42 · Apr 25, 2026</Text>
                <Text className="text-3xl font-black text-white m-0 mb-2 leading-tight">The Weekly<br />Dispatch.</Text>
                <Text className="text-gray-400 text-sm m-0">Curated dev tools, articles & ideas.</Text>
              </Section>
            </Section>

            {/* Feature article */}
            <Section className="bg-white rounded-2xl overflow-hidden mb-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <Img src="https://picsum.photos/seed/tech2026/1200/500" alt="Feature" width="600" height="240" style={{ display: 'block', width: '100%', objectFit: 'cover' }} />
              <Section className="px-8 py-8">
                <Text className="text-xs font-bold uppercase tracking-[0.15em] text-blue-500 m-0 mb-3">🔥 Featured</Text>
                <Text className="text-xl font-bold text-gray-900 m-0 mb-3 leading-snug">How AI is reshaping email design in 2026</Text>
                <Text className="text-sm text-gray-500 leading-6 m-0 mb-4">
                  From hyper-personalization to automated accessibility checks, AI is no longer a futuristic concept but a daily tool for email marketers everywhere.
                </Text>
                <Link href="#" style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>Read the full article →</Link>
              </Section>
            </Section>

            {/* 2-col resources */}
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
              <tr>
                <td style={{ padding: '0 4px 0 0', width: '50%', verticalAlign: 'top' }}>
                  <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <Img src="https://picsum.photos/seed/uikit26/400/200" alt="UI Kit" width="300" height="140" style={{ display: 'block', width: '100%', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <Text className="text-xs font-bold uppercase tracking-wider text-gray-400 m-0 mb-1">Tools</Text>
                      <Text className="text-sm font-bold text-gray-900 m-0 mb-1">Free UI Kit 3.0</Text>
                      <Text className="text-xs text-gray-500 m-0 mb-3">250+ components for your next project.</Text>
                      <Link href="#" style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600' }}>Download →</Link>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0 0 0 4px', width: '50%', verticalAlign: 'top' }}>
                  <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <Img src="https://picsum.photos/seed/colorguide/400/200" alt="Color Guide" width="300" height="140" style={{ display: 'block', width: '100%', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <Text className="text-xs font-bold uppercase tracking-wider text-gray-400 m-0 mb-1">Guide</Text>
                      <Text className="text-sm font-bold text-gray-900 m-0 mb-1">Color Theory 2026</Text>
                      <Text className="text-xs text-gray-500 m-0 mb-3">Master modern palettes for digital.</Text>
                      <Link href="#" style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600' }}>Read Guide →</Link>
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <Hr className="border-gray-200 m-0 mb-6" />
            <Text className="text-xs text-gray-400 text-center m-0 leading-6">
              The Dispatch · San Francisco, CA<br />
              <a href="#" style={{ color: '#9ca3af' }}>Unsubscribe</a> · <a href="#" style={{ color: '#9ca3af' }}>Privacy</a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim(),
    language: 'typescript'
  },
  {
    id: 'welcome-v2',
    name: 'Resend Welcome',
    code: `
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

// Note: Local imports like ./theme are not supported in the live editor. 
// They are mocked for this demonstration.

export const WelcomeEmail = () => (
  <Tailwind>
    <Html>
      <Head />
      <Body className="bg-white m-0 font-sans text-center">
        <Preview>Welcome aboard—Resend</Preview>
        <Container className="mx-auto mt-8 w-full max-w-[640px]">
          <Section className="bg-white px-6 py-4 border border-slate-100 rounded-xl shadow-sm">
            <Section className="mb-6">
              <Row>
                <Column className="py-[7px] w-1/2 align-middle">
                  <Img
                    src="https://react.email/static/logo-black.png"
                    alt="Logo"
                    width={23}
                    className="block"
                  />
                </Column>
                <Column align="right" className="py-[7px] w-1/2 align-middle">
                  <Text className="m-0 text-sm text-slate-500 text-right">
                    Resend
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="bg-slate-50 mb-6 p-8 rounded-xl border border-slate-100">
              <Section className="mb-6">
                <Img
                  src="https://react.email/static/barebones-image.png"
                  alt="Welcome"
                  width={600}
                  className="block mx-auto rounded-xl w-full"
                />
              </Section>
              <Section className="mx-auto max-w-[422px] text-center">
                <Text className="mt-0 mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Thanks for joining us
                </Text>
                <Heading className="mt-0 mb-6 text-3xl font-bold text-slate-900">
                  Welcome aboard
                </Heading>
                <Text className="m-0 text-slate-600 leading-relaxed">
                  You're all set. Open your dashboard to explore the
                  basics, connect a few tools, and invite your team when
                  you're ready.
                </Text>
              </Section>
            </Section>

            <Section className="text-center pb-8">
              <Button
                href="https://resend.com"
                className="bg-slate-900 text-white px-10 py-4 rounded-lg font-bold text-sm"
              >
                Go to Dashboard
              </Button>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default WelcomeEmail;
`.trim(),
    language: 'typescript'
  },
  {
    id: 'shipping-confirmation',
    name: 'Order Shipped & Tracking',
    code: `
import React from 'react';
import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text, 
  Button,
  Link,
  Img,
  Row,
  Column,
  Hr,
  Tailwind
} from '@react-email/components';

export default function ShippingConfirmationEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Your order is on the way! Track your package here.</Preview>
        <Body className="bg-gray-50 py-12 font-sans">
          <Container className="bg-white border border-gray-200 rounded-2xl overflow-hidden mx-auto max-w-[600px] shadow-sm">
            {/* Elegant Premium Header */}
            <Section className="bg-gray-900 text-white p-10 text-center">
              <Text className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2">Order Confirmed</Text>
              <Heading className="text-3xl font-black text-white m-0 tracking-tight">On Its Way!</Heading>
              <Text className="text-gray-400 text-sm mt-3 m-0">Hi Sarah, your items have shipped and will arrive by Oct 24th.</Text>
            </Section>

            {/* Delivery Timeline Progress Bar */}
            <Section className="px-10 py-8 border-b border-gray-100 bg-gray-50/50">
              <Heading className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Delivery Progress</Heading>
              <Row className="mb-2">
                <Column className="text-center w-1/3 py-2 border-b-4 border-indigo-600">
                  <Text className="text-[10px] font-bold text-indigo-600 m-0 uppercase">Ordered</Text>
                </Column>
                <Column className="text-center w-1/3 py-2 border-b-4 border-indigo-600">
                  <Text className="text-[10px] font-bold text-indigo-600 m-0 uppercase">Shipped</Text>
                </Column>
                <Column className="text-center w-1/3 py-2 border-b-4 border-gray-200">
                  <Text className="text-[10px] font-bold text-gray-400 m-0 uppercase">Out for Delivery</Text>
                </Column>
              </Row>
              <Row>
                <Column className="text-left w-1/2">
                  <Text className="text-xs text-gray-500 m-0">Shipped: Oct 20</Text>
                </Column>
                <Column className="text-right w-1/2">
                  <Text className="text-xs text-gray-500 m-0">Est. Delivery: Oct 24</Text>
                </Column>
              </Row>
            </Section>

            {/* Package Items & Quantities Grid */}
            <Section className="p-10">
              <Heading className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Shipment Details</Heading>
              
              <Row className="mb-6">
                <Column className="w-16">
                  <Img 
                    src="https://picsum.photos/seed/headphone/200/200" 
                    alt="Wireless Headphones" 
                    width="60" 
                    height="60" 
                    className="rounded-xl border border-gray-100 object-cover"
                  />
                </Column>
                <Column className="pl-4">
                  <Text className="text-sm font-bold text-gray-900 m-0">Aura Pro Wireless Headphones</Text>
                  <Text className="text-xs text-gray-500 m-0">Color: Midnight Black • Qty: 1</Text>
                </Column>
                <Column className="text-right align-middle">
                  <Text className="text-sm font-bold font-mono text-gray-900 m-0">$249.00</Text>
                </Column>
              </Row>

              <Row className="mb-6">
                <Column className="w-16">
                  <Img 
                    src="https://picsum.photos/seed/case/200/200" 
                    alt="Travel Case" 
                    width="60" 
                    height="60" 
                    className="rounded-xl border border-gray-100 object-cover"
                  />
                </Column>
                <Column className="pl-4">
                  <Text className="text-sm font-bold text-gray-900 m-0">Hard-shell Travel Case</Text>
                  <Text className="text-xs text-gray-500 m-0">Color: Charcoal Grey • Qty: 1</Text>
                </Column>
                <Column className="text-right align-middle">
                  <Text className="text-sm font-bold font-mono text-gray-900 m-0">$39.00</Text>
                </Column>
              </Row>

              <Hr className="border-gray-100 my-6" />

              {/* Pricing breakdown */}
              <Section className="w-full text-sm">
                <Row className="mb-2">
                  <Column className="text-gray-500 text-left">Subtotal</Column>
                  <Column className="text-gray-900 text-right font-mono">$288.00</Column>
                </Row>
                <Row className="mb-2">
                  <Column className="text-gray-500 text-left">Shipping</Column>
                  <Column className="text-gray-900 text-right font-mono">FREE</Column>
                </Row>
                <Row className="mb-4">
                  <Column className="text-gray-500 text-left">Tax</Column>
                  <Column className="text-gray-900 text-right font-mono">$24.48</Column>
                </Row>
                <Hr className="border-gray-100 my-4" />
                <Row>
                  <Column className="text-gray-900 font-bold text-left text-base">Total Paid</Column>
                  <Column className="text-indigo-600 font-bold text-right text-lg font-mono">$312.48</Column>
                </Row>
              </Section>

              {/* Action Button */}
              <Section className="text-center mt-10">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/20 text-center text-sm"
                  href="https://example.com/track/123456"
                >
                  Track Package Delivery
                </Button>
              </Section>
            </Section>

            {/* Support / Help Section */}
            <Section className="bg-gray-50 p-10 text-center border-t border-gray-100">
              <Text className="text-gray-400 text-xs mb-6 m-0 leading-relaxed">
                Need support with your order? Our support team is here to assist 24/7. <br />
                Visit our <Link href="#" className="text-indigo-600 font-bold underline">Help Center</Link> or reply directly to this email.
              </Text>
              <Text className="text-gray-500 font-bold text-[10px] uppercase tracking-widest m-0">
                LUXE DESIGN LTD • San Francisco • CA
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim(),
    language: 'typescript'
  },
  {
    id: 'tech-summit',
    name: 'Tech Summit RSVP',
    code: `
import React from 'react';
import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text, 
  Button,
  Link,
  Img,
  Row,
  Column,
  Hr,
  Tailwind
} from '@react-email/components';

export default function TechSummitEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Join us at the Global Tech Summit 2026 — RSVP Today</Preview>
        <Body className="bg-[#030712] font-sans text-white py-12">
          <Container className="bg-[#0b0f19] border border-gray-800 rounded-3xl overflow-hidden mx-auto max-w-[580px] shadow-2xl">
            <Section className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent p-10 text-center relative border-b border-gray-900">
              <Img 
                src="https://react.email/static/logo-black.png" 
                alt="Summit Logo" 
                width="36" 
                height="36" 
                className="mx-auto mb-6 opacity-80 invert"
              />
              <Text className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2">Exclusive Invitation</Text>
              <Heading className="text-3xl md:text-4xl font-black text-white m-0 tracking-tight leading-tight">
                Global Tech <br />
                Summit 2026
              </Heading>
            </Section>

            <Section className="p-10 space-y-6">
              <Text className="text-gray-300 text-base leading-relaxed">
                Hi Innovator,
              </Text>
              <Text className="text-gray-300 text-base leading-relaxed">
                The future is arriving ahead of schedule. We're gathering the world's leading engineers, creators, and leaders for three days of intense exploration, design, and systems architecture.
              </Text>

              <Section className="bg-[#111827] border border-gray-800 rounded-2xl p-6 my-8">
                <Row className="mb-4">
                  <Column className="w-12 text-center align-middle">
                    <Text className="text-xl m-0">📅</Text>
                  </Column>
                  <Column className="pl-3 align-middle">
                    <Text className="text-sm font-bold text-white m-0">DATE & TIME</Text>
                    <Text className="text-xs text-gray-400 m-0">October 14-16, 2026 • 9:00 AM PST</Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-12 text-center align-middle">
                    <Text className="text-xl m-0">📍</Text>
                  </Column>
                  <Column className="pl-3 align-middle">
                    <Text className="text-sm font-bold text-white m-0">LOCATION</Text>
                    <Text className="text-xs text-gray-400 m-0">Innovation Center • San Francisco, CA & Online</Text>
                  </Column>
                </Row>
              </Section>

              <Section className="text-center py-6">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-indigo-600/30 text-center transition-all"
                  href="https://example.com/rsvp"
                >
                  Confirm Your RSVP
                </Button>
              </Section>
            </Section>

            <Section className="bg-[#090d16] p-10 text-center border-t border-gray-900">
              <Text className="text-gray-500 text-xs leading-relaxed mb-6">
                You received this exclusive invitation based on your contribution to the developer ecosystem. 
                If you choose not to attend, you can <Link href="#" className="text-indigo-400 underline">decline invitation</Link>.
              </Text>
              <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] m-0">
                Tech Summit Lab • San Francisco • CA
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim(),
    language: 'typescript'
  },
  {
    id: 'legacy-html',
    name: 'Plain HTML Template',
    code: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background-color: #f4f4f4; padding: 40px; }
    .card { background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-top: 0; }
    p { color: #666; line-height: 1.6; }
    .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Classic HTML Email</h1>
    <p>This is a raw HTML/CSS email template. No React involved here—just pure web standards.</p>
    <p>Email.Pro handles both modern React templates and legacy HTML templates seamlessly.</p>
    <a href="#" class="btn">Learn More</a>
  </div>
</body>
</html>
`.trim(),
    language: 'html'
  }
];
