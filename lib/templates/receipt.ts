export const receiptTemplate = `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Hr, Row, Column, Tailwind } from '@react-email/components';

export default function ReceiptEmail() {
  const lineItems = [
    { name: 'Linear Pro Workspace (Annual Plan)', qty: '12 seats', price: '$1,152.00', desc: 'Renews Oct 24, 2027' },
    { name: 'Linear Asynchronous Integration Suite', qty: '1 addon', price: '$120.00', desc: 'Renews Oct 24, 2027' },
  ];
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Order Confirmed — Invoice #INV-849201-US</Preview>
        <Body className="bg-[#FAF9F6] font-sans antialiased text-neutral-800">
          <Container className="mx-auto max-w-[580px] py-16 px-4">

            {/* Logo */}
            <Section className="mb-10 text-center">
              <div className="inline-block w-9 h-9 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-sm">
                <Text className="text-white font-bold text-sm m-0">⚡</Text>
              </div>
            </Section>

            {/* Dark Styled Success Header Banner */}
            <Section className="bg-[#0b0f19] rounded-t-3xl p-10 text-center border border-neutral-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 bg-indigo-950 border border-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Text className="text-2xl m-0">✓</Text>
              </div>
              <Text className="text-indigo-400 font-black uppercase tracking-widest text-[10px] m-0 mb-1">Payment Received</Text>
              <Text className="text-white text-2xl font-black m-0 mb-2 tracking-tight">Invoice Paid Successfully</Text>
              <Text className="text-gray-400 text-xs m-0 font-mono">Invoice #INV-849201-US · Oct 24, 2026</Text>
            </Section>

            {/* Main Billing and Items Details Card */}
            <Section className="bg-white rounded-b-3xl px-10 py-10 mb-6 border-x border-b border-neutral-200/50 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)]">
              <Text className="text-xs font-black uppercase tracking-widest text-neutral-400 m-0 mb-6">Billed Items</Text>
              
              {lineItems.map((item, idx) => (
                <Section key={idx} className="mb-6">
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>
                        <Text className="text-sm font-bold text-neutral-900 m-0">{item.name}</Text>
                        <Text className="text-xs text-neutral-400 m-0 mt-0.5">{item.desc}</Text>
                        <Text className="text-[10px] bg-neutral-100 border border-neutral-200/40 text-neutral-500 font-bold px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wide">
                          Qty: {item.qty}
                        </Text>
                      </td>
                      <td style={{ verticalAlign: 'top', textAlign: 'right' }}>
                        <Text className="text-sm font-mono font-bold text-neutral-900 m-0">{item.price}</Text>
                      </td>
                    </tr>
                  </table>
                  {idx < lineItems.length - 1 && <Hr className="border-neutral-100 my-5" />}
                </Section>
              ))}

              <Hr className="border-neutral-200 my-6" />

              {/* Pricing breakdown */}
              <Section className="w-full text-xs">
                <Row className="mb-2.5">
                  <Column className="text-neutral-400 text-left">Subtotal</Column>
                  <Column className="text-neutral-700 text-right font-mono font-bold">$1,272.00</Column>
                </Row>
                <Row className="mb-2.5">
                  <Column className="text-neutral-400 text-left">VAT / Sales Tax (0%)</Column>
                  <Column className="text-neutral-700 text-right font-mono">$0.00</Column>
                </Row>
                <Row className="mb-4">
                  <Column className="text-neutral-400 text-left">Discounts (10% early adopter)</Column>
                  <Column className="text-emerald-600 text-right font-mono font-bold">-$127.20</Column>
                </Row>
                <Hr className="border-neutral-100 my-4" />
                <Row>
                  <Column className="text-neutral-900 font-black text-left text-sm uppercase tracking-wide">Total Paid</Column>
                  <Column className="text-indigo-600 font-black text-right text-base font-mono">$1,144.80</Column>
                </Row>
              </Section>
            </Section>

            {/* Payment Method & Shipping Details */}
            <Section className="bg-white rounded-3xl p-8 mb-8 border border-neutral-200/50 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.02)]">
              <Row>
                <Column className="w-1/2 align-top">
                  <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-400 m-0 mb-2">Payment Method</Text>
                  <Text className="text-xs font-bold text-neutral-800 m-0 leading-relaxed">
                    💳 Visa ending in 4242<br />
                    Alex Johnson · exp 12/28
                  </Text>
                </Column>
                <Column className="w-1/2 align-top pl-4">
                  <Text className="text-[10px] font-black uppercase tracking-widest text-neutral-400 m-0 mb-2">Billed To</Text>
                  <Text className="text-xs font-bold text-neutral-800 m-0 leading-relaxed">
                    Acme Engineering LLC<br />
                    100 Market St, San Francisco, CA
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-neutral-200 m-0 mb-6" />
            <Text className="text-xs text-neutral-400 text-center m-0 leading-relaxed">
              Questions about this invoice? Reply to this email or reach our billing support team at <a href="#" style={{ color: '#6366f1', fontWeight: 'bold' }}>billing@linear.app</a>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();
