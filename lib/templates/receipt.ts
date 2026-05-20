export const receiptTemplate = `
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
`.trim();
