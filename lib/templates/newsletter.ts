export const newsletterTemplate = `
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
`.trim();
