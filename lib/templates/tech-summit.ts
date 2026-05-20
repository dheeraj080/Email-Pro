export const techSummitTemplate = `
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
`.trim();
