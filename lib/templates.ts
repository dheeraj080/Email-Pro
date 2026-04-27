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

export const TEMPLATES = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    code: DEFAULT_TEMPLATE,
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
`.trim()
  }
];
