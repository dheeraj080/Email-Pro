export const newsletterTemplate = `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Link, Img, Hr, Tailwind } from '@react-email/components';

export default function NewsletterEmail() {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>The Systems Architecture Weekly — Issue #108</Preview>
        <Body className="bg-[#FAF9F6] font-sans antialiased text-neutral-800">
          <Container className="mx-auto max-w-[600px] py-16 px-4">

            {/* Newsletter Branding Header Card */}
            <Section className="bg-[#0b0f19] rounded-3xl p-10 text-center border border-neutral-900 relative overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <Text className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 m-0 mb-3">Systems & Edge Architecture</Text>
              <Text className="text-white text-3xl font-black m-0 mb-3 tracking-tight leading-tight">The Edge Dispatch</Text>
              <Text className="text-gray-400 text-xs m-0">Issue #108 · April 25, 2026 · Curated by core systems engineers.</Text>
            </Section>

            {/* Main Feature Highlight Article Card */}
            <Section className="bg-white rounded-3xl overflow-hidden border border-neutral-200/50 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] mb-6">
              <Img 
                src="https://picsum.photos/seed/techweekly/1200/500" 
                alt="Feature Banner" 
                width="600" 
                height="240" 
                style={{ display: 'block', width: '100%', objectFit: 'cover' }} 
              />
              <Section className="p-8">
                <Text className="text-[10px] font-black uppercase tracking-widest text-indigo-600 m-0 mb-3">🔥 Deep Dive</Text>
                <Text className="text-xl font-bold text-neutral-900 m-0 mb-3 leading-snug">
                  Deploying high-performance edge rendering architectures with zero latency cold-starts
                </Text>
                <Text className="text-xs text-neutral-500 leading-relaxed m-0 mb-6">
                  Cold starts in serverless functions remain one of the biggest bottlenecks for responsive user experiences. In this issue, we explore how v8 isolates combined with local CDN caching can reduce cold starts by up to 98.4%.
                </Text>
                <Link 
                  href="https://example.com/edge-dispatch/108" 
                  style={{ color: '#4f46e5', fontSize: '12px', fontWeight: '800', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  Read full article &rarr;
                </Link>
              </Section>
            </Section>

            {/* Secondary Multi-Column Article Grid */}
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
              <tr>
                <td style={{ paddingRight: '6px', width: '50%', verticalAlign: 'top' }}>
                  <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                    <Img 
                      src="https://picsum.photos/seed/uikit26/600/350" 
                      alt="Article 2" 
                      width="300" 
                      height="150" 
                      style={{ display: 'block', width: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '20px' }}>
                      <Text className="text-[9px] font-black uppercase tracking-wider text-neutral-400 m-0 mb-1.5">Rust Compiler</Text>
                      <Text className="text-sm font-bold text-neutral-900 m-0 mb-2 leading-snug">Rust compiler performance updates</Text>
                      <Text className="text-[11px] text-neutral-500 m-0 mb-4 leading-relaxed">Understanding incremental compile changes in 1.94.</Text>
                      <Link href="#" style={{ color: '#4f46e5', fontSize: '11px', fontWeight: '800', textDecoration: 'none' }}>Read &rarr;</Link>
                    </div>
                  </div>
                </td>
                <td style={{ paddingLeft: '6px', width: '50%', verticalAlign: 'top' }}>
                  <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                    <Img 
                      src="https://picsum.photos/seed/colorguide/600/350" 
                      alt="Article 3" 
                      width="300" 
                      height="150" 
                      style={{ display: 'block', width: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '20px' }}>
                      <Text className="text-[9px] font-black uppercase tracking-wider text-neutral-400 m-0 mb-1.5">Edge Caching</Text>
                      <Text className="text-sm font-bold text-neutral-900 m-0 mb-2 leading-snug">Stale-while-revalidate in 2026</Text>
                      <Text className="text-[11px] text-neutral-500 m-0 mb-4 leading-relaxed">Best caching directives for globally synchronized API nodes.</Text>
                      <Link href="#" style={{ color: '#4f46e5', fontSize: '11px', fontWeight: '800', textDecoration: 'none' }}>Read &rarr;</Link>
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            {/* Footer */}
            <Hr className="border-neutral-200 m-0 mb-6" />
            <Text className="text-xs text-neutral-400 text-center m-0 leading-relaxed">
              You are receiving this because you subscribed to the Edge Dispatch newsletter. <br />
              The Edge Dispatch Corp · 440 Mission St, San Francisco, CA<br />
              <a href="#" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Unsubscribe</a> · <a href="#" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Update Preferences</a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();
