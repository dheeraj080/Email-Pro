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
        <Preview>Exclusive invitation: Global Tech Summit 2026. RSVP inside.</Preview>
        <Body className="bg-[#030712] font-sans text-white py-16 antialiased">
          <Container className="bg-[#090d16] border border-neutral-800 rounded-3xl overflow-hidden mx-auto max-w-[580px] shadow-2xl">
            
            {/* Holographic Glowing Header */}
            <Section className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent p-12 text-center relative border-b border-neutral-900">
              <Img 
                src="https://react.email/static/logo-black.png" 
                alt="Summit Logo" 
                width="32" 
                height="32" 
                className="mx-auto mb-6 opacity-90 invert"
              />
              <Text className="text-indigo-400 font-black uppercase tracking-widest text-[9px] mb-2 m-0">Exclusive Invitation</Text>
              <Heading className="text-3xl font-black text-white m-0 tracking-tight leading-tight">
                Global Tech <br />
                Summit 2026
              </Heading>
              <Text className="text-gray-400 text-xs mt-3 m-0">October 14-16, 2026 · San Francisco, CA & Online</Text>
            </Section>

            {/* Event Description */}
            <Section className="p-10">
              <Text className="text-gray-300 text-sm leading-relaxed m-0 mb-4">
                Hi Innovator,
              </Text>
              <Text className="text-gray-300 text-sm leading-relaxed m-0 mb-8">
                The future is arriving ahead of schedule. We're gathering the world's leading engineers, creators, and leaders for three days of intense exploration, systems design, and hands-on workshops.
              </Text>

              {/* Event Details Panel */}
              <Section className="bg-[#0d1220] border border-neutral-800 rounded-2xl p-6 mb-8">
                <Row className="mb-4">
                  <Column className="w-10 text-center align-middle">
                    <Text className="text-lg m-0">📅</Text>
                  </Column>
                  <Column className="pl-3 align-middle">
                    <Text className="text-[10px] font-black text-indigo-400 m-0 uppercase tracking-wider">Date & Time</Text>
                    <Text className="text-xs text-white m-0 font-bold mt-0.5">October 14-16, 2026 · 9:00 AM PST</Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-10 text-center align-middle">
                    <Text className="text-lg m-0">📍</Text>
                  </Column>
                  <Column className="pl-3 align-middle">
                    <Text className="text-[10px] font-black text-indigo-400 m-0 uppercase tracking-wider">Location</Text>
                    <Text className="text-xs text-white m-0 font-bold mt-0.5">Innovation Hub · San Francisco, CA & Virtual</Text>
                  </Column>
                </Row>
              </Section>

              {/* RSVP Action */}
              <Section className="text-center py-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider py-4.5 px-10 rounded-xl shadow-lg shadow-indigo-600/30 text-center transition-all"
                  href="https://example.com/rsvp"
                >
                  Confirm Your RSVP &rarr;
                </Button>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="bg-[#060a12] p-10 text-center border-t border-neutral-900">
              <Text className="text-neutral-500 text-xs leading-relaxed mb-6 m-0">
                You received this exclusive invitation based on your contribution to the developer ecosystem. 
                If you choose not to attend, you can <Link href="#" className="text-indigo-400 underline">decline invitation</Link>.
              </Text>
              <Text className="text-neutral-400 font-bold text-[9px] uppercase tracking-widest m-0">
                Tech Summit Lab · San Francisco · CA
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();
