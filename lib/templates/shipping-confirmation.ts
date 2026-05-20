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
`.trim();
