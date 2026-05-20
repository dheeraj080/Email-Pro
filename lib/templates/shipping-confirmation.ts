export const shippingConfirmationTemplate = `
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
        <Preview>📦 Your package has shipped! Est. delivery: Oct 24.</Preview>
        <Body className="bg-[#FAF9F6] py-16 font-sans antialiased text-neutral-800">
          <Container className="bg-white border border-neutral-200/60 rounded-3xl overflow-hidden mx-auto max-w-[580px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)]">
            
            {/* Header Banner */}
            <Section className="bg-[#0b0f19] text-white p-10 text-center border-b border-neutral-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl pointer-events-none" />
              <Text className="text-indigo-400 font-black tracking-widest uppercase text-[10px] mb-2 m-0">Delivery Status</Text>
              <Heading className="text-2xl font-black text-white m-0 tracking-tight">Your Order is on the Way</Heading>
              <Text className="text-gray-400 text-xs mt-3 m-0">Hi Sarah, your items have shipped and will arrive by Oct 24th.</Text>
            </Section>

            {/* Delivery Progress Bar */}
            <Section className="px-10 py-8 border-b border-neutral-100 bg-neutral-50/50">
              <Heading className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-4 m-0">Delivery Timeline</Heading>
              <Row className="mb-3">
                <Column className="text-center w-1/3 py-2 border-b-4 border-indigo-600">
                  <Text className="text-[9px] font-black text-indigo-600 m-0 uppercase tracking-wide">Ordered</Text>
                </Column>
                <Column className="text-center w-1/3 py-2 border-b-4 border-indigo-600">
                  <Text className="text-[9px] font-black text-indigo-600 m-0 uppercase tracking-wide">Shipped</Text>
                </Column>
                <Column className="text-center w-1/3 py-2 border-b-4 border-neutral-200">
                  <Text className="text-[9px] font-black text-neutral-400 m-0 uppercase tracking-wide">Delivered</Text>
                </Column>
              </Row>
              <Row>
                <Column className="text-left w-1/2">
                  <Text className="text-xs text-neutral-500 m-0">Shipped: Oct 20</Text>
                </Column>
                <Column className="text-right w-1/2">
                  <Text className="text-xs text-neutral-500 m-0">Est. Delivery: Oct 24</Text>
                </Column>
              </Row>
            </Section>

            {/* Package Details */}
            <Section className="p-10">
              <Heading className="text-xs font-black text-neutral-400 mb-6 uppercase tracking-wider m-0">Shipment Details</Heading>
              
              <Row className="mb-6">
                <Column className="w-16">
                  <Img 
                    src="https://picsum.photos/seed/headphone/200/200" 
                    alt="Wireless Headphones" 
                    width="60" 
                    height="60" 
                    className="rounded-2xl border border-neutral-200/80 object-cover"
                  />
                </Column>
                <Column className="pl-4">
                  <Text className="text-sm font-bold text-neutral-900 m-0">Aura Pro Wireless Headphones</Text>
                  <Text className="text-xs text-neutral-400 m-0 mt-0.5">Color: Midnight Black • Qty: 1</Text>
                </Column>
                <Column className="text-right align-middle">
                  <Text className="text-sm font-mono font-bold text-neutral-900 m-0">$249.00</Text>
                </Column>
              </Row>

              <Row className="mb-6">
                <Column className="w-16">
                  <Img 
                    src="https://picsum.photos/seed/case/200/200" 
                    alt="Travel Case" 
                    width="60" 
                    height="60" 
                    className="rounded-2xl border border-neutral-200/80 object-cover"
                  />
                </Column>
                <Column className="pl-4">
                  <Text className="text-sm font-bold text-neutral-900 m-0">Hard-shell Travel Case</Text>
                  <Text className="text-xs text-neutral-400 m-0 mt-0.5">Color: Charcoal Grey • Qty: 1</Text>
                </Column>
                <Column className="text-right align-middle">
                  <Text className="text-sm font-mono font-bold text-neutral-900 m-0">$39.00</Text>
                </Column>
              </Row>

              <Hr className="border-neutral-100 my-6" />

              {/* Action Button */}
              <Section className="text-center mt-8">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider py-4.5 px-10 rounded-xl shadow-lg shadow-indigo-600/10 text-center"
                  href="https://example.com/track/123456"
                >
                  Track Package Delivery &rarr;
                </Button>
              </Section>
            </Section>

            {/* Bottom Support Section */}
            <Section className="bg-neutral-50 p-10 text-center border-t border-neutral-100">
              <Text className="text-neutral-400 text-xs mb-6 m-0 leading-relaxed">
                Need support with your order? Our support team is here to assist 24/7. <br />
                Visit our <Link href="#" className="text-indigo-600 font-bold underline">Help Center</Link> or reply directly to this email.
              </Text>
              <Text className="text-neutral-400 font-bold text-[9px] uppercase tracking-widest m-0">
                Luxe Design Ltd · 100 Pine St · San Francisco · CA
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();
