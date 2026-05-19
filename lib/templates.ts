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
  Hr,
  Tailwind
} from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Email Pro!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-10 px-5 max-w-[600px]">
            <Heading className="text-3xl font-bold text-center text-gray-800 mb-6">
              Welcome to the Team!
            </Heading>
            <Section className="bg-gray-50 rounded-lg p-8 border border-gray-100">
              <Text className="text-gray-700 text-lg leading-7 mb-4">
                Hi there,
              </Text>
              <Text className="text-gray-700 text-lg leading-7 mb-6">
                We're absolutely thrilled to have you join our growing community of 
                designers and developers. With Email Pro, creating stunning templates 
                has never been easier.
              </Text>
              <Button
                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md text-center block"
                href="https://example.com"
              >
                Get Started Now
              </Button>
            </Section>
            <Hr className="border-gray-200 my-8" />
            <Text className="text-gray-400 text-sm text-center">
              © 2026 Email Pro Inc. <br />
              123 Innovation Way, San Francisco, CA 94105
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
  Tailwind
} from '@react-email/components';

export default function ResetPasswordEmail() {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans py-12">
          <Container className="bg-white border border-slate-200 rounded-xl shadow-sm mx-auto p-12 max-w-[500px]">
            <Heading className="text-2xl font-bold text-slate-900 mb-4">
              Reset Password
            </Heading>
            <Text className="text-slate-600 text-base leading-6 mb-6">
              We received a request to reset your password. If you didn't make 
              this request, you can safely ignore this email.
            </Text>
            <Button
              className="bg-slate-900 text-white font-medium py-3 px-8 rounded-lg text-center"
              href="https://example.com/reset"
            >
              Reset Password
            </Button>
            <Text className="mt-8 text-slate-400 text-xs">
              If the button above doesn't work, copy and paste this link into your browser: 
              https://example.com/reset-link-goes-here
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
import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text, 
  Hr,
  Row,
  Column,
  Tailwind
} from '@react-email/components';

export default function ReceiptEmail() {
  return (
    <Html>
      <Head />
      <Preview>Your Order Receipt #12345</Preview>
      <Tailwind>
        <Body className="bg-gray-50 py-8 font-sans">
          <Container className="bg-white border border-gray-200 p-10 mx-auto max-w-[600px]">
            <Heading className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-indigo-600 pb-2 inline-block">
              REPLENISH
            </Heading>
            <Text className="text-gray-600 mb-8">
              Thank you for your purchase! Your order is being processed and will ship soon.
            </Text>
            
            <Section className="mb-4">
              <Row>
                <Column className="text-left py-2 font-bold text-gray-900">Item</Column>
                <Column className="text-right py-2 font-bold text-gray-900">Price</Column>
              </Row>
              <Hr className="border-gray-100" />
              <Row>
                <Column className="text-left py-3 text-gray-600">The Minimalist Watch × 1</Column>
                <Column className="text-right py-3 text-gray-600 font-mono">$120.00</Column>
              </Row>
              <Row>
                <Column className="text-left py-3 text-gray-600">Premium Leather Strap × 1</Column>
                <Column className="text-right py-3 text-gray-600 font-mono">$45.00</Column>
              </Row>
              <Hr className="border-gray-100" />
              <Row>
                <Column className="text-left py-4 font-bold text-gray-900">Total</Column>
                <Column className="text-right py-4 font-bold text-indigo-600 font-mono text-xl">$165.00</Column>
              </Row>
            </Section>

            <Text className="text-gray-400 text-xs mt-10">
              Questions? Reply to this email or visit our help center.
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
import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Preview, 
  Section, 
  Text, 
  Link,
  Img,
  Row,
  Column,
  Hr,
  Tailwind
} from '@react-email/components';

export default function NewsletterEmail() {
  return (
    <Html>
      <Head />
      <Preview>The Weekly Dispatch: Fresh insights, new tools, and community highlights</Preview>
      <Tailwind>
        <Body className="bg-slate-100 font-sans py-12">
          <Container className="bg-white border border-slate-200 shadow-xl mx-auto overflow-hidden rounded-2xl max-w-[600px]">
            <Section className="bg-slate-900 px-10 py-12 text-center">
              <Text className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-2">Issue #42</Text>
              <Heading className="text-3xl font-black text-white m-0 tracking-tight">The Dispatch</Heading>
            </Section>
            
            <Section className="p-10">
              <Text className="text-slate-500 text-sm mb-4">April 25, 2026</Text>
              <Heading className="text-xl font-bold text-slate-900 mb-4">This week's highlights</Heading>
              
              <Section className="mb-10">
                <Img 
                  src="https://picsum.photos/seed/tech/1200/600" 
                  alt="Feature Image" 
                  width="520" 
                  height="260" 
                  className="rounded-xl object-cover mb-4"
                />
                <Heading className="text-lg font-bold text-slate-800 mb-2">How AI is reshaping email design</Heading>
                <Text className="text-slate-600 leading-relaxed mb-4">
                  From hyper-personalization to automated accessibility checks, AI is no longer a futuristic concept but a daily tool for email marketers.
                </Text>
                <Link href="#" className="text-blue-600 font-semibold text-sm">Read the full article →</Link>
              </Section>

              <Hr className="border-slate-100 mb-10" />

              <Row className="mb-8">
                <Column className="pr-4">
                  <Img 
                    src="https://picsum.photos/seed/tool/400/400" 
                    alt="Tool" 
                    width="150" 
                    height="150" 
                    className="rounded-lg object-cover mb-3"
                  />
                  <Text className="font-bold text-slate-800 text-sm mb-1">New UI Kit</Text>
                  <Text className="text-slate-500 text-xs mb-2">A free set of components for your next project.</Text>
                  <Link href="#" className="text-blue-600 font-medium text-xs">Download</Link>
                </Column>
                <Column>
                  <Img 
                    src="https://picsum.photos/seed/book/400/400" 
                    alt="Book" 
                    width="150" 
                    height="150" 
                    className="rounded-lg object-cover mb-3"
                  />
                  <Text className="font-bold text-slate-800 text-sm mb-1">Design Guide</Text>
                  <Text className="text-slate-500 text-xs mb-2">Master the art of color theory in digital design.</Text>
                  <Link href="#" className="text-blue-600 font-medium text-xs">View Guide</Link>
                </Column>
              </Row>
            </Section>

            <Section className="bg-slate-50 p-10 text-center border-t border-slate-100">
              <Text className="text-slate-400 text-xs mb-6">
                You're receiving this because you're a valued member of our community. 
                If you'd rather not hear from us, you can <Link href="#" className="text-slate-400 underline">unsubscribe</Link>.
              </Text>
              <Text className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                Email Pro • San Francisco • CA
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
      <Head />
      <Preview>Your order is on the way! Track your package here.</Preview>
      <Tailwind>
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
      <Head />
      <Preview>Join us at the Global Tech Summit 2026 — RSVP Today</Preview>
      <Tailwind>
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
