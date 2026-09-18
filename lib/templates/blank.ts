export const blankReactEmailTemplate = `
import React from 'react';
import { Body, Container, Head, Html, Preview, Section, Text, Heading, Tailwind } from '@react-email/components';

export default function BlankEmail() {
  return (
    <Html lang="en">
      <Head>
        <title>New Email</title>
      </Head>
      <Preview>Your new email template starter</Preview>
      <Tailwind>
        <Body className="bg-[#f8fafc] font-sans text-neutral-800 antialiased py-12 px-4">
          <Container className="mx-auto max-w-[580px] bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm">
            <Section className="mb-4">
              <Heading className="text-2xl font-bold text-neutral-900 m-0 tracking-tight">
                New Email Template
              </Heading>
            </Section>
            <Section>
              <Text className="text-base text-neutral-600 leading-relaxed m-0">
                Start writing your custom email here. You can use React Email components or standard inline styles.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
`.trim();

export const blankHtmlEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; margin: 0; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <tr>
            <td>
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0f172a;">New Email Template</h1>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #475569;">Start writing your custom email here with standard HTML and email-client-compatible table structures.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
