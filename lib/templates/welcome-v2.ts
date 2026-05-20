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
`.trim();
