import { NextResponse } from 'next/server';
import { isRawHtml } from '@/lib/template-compiler';
import { rendererClient } from '@/lib/renderer-client';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code, language, templates = [] } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Valid code string is required' }, { status: 400 });
    }

    if (language === 'html' || isRawHtml(code)) {
      return NextResponse.json({ html: code });
    }

    const html = await rendererClient.render(code, templates);
    return NextResponse.json({ html });
  } catch (error: any) {
    const rawMessage = error && error.message ? error.message : 'Failed to render email template';
    // Sanitize any server filesystem paths or stack traces from error messages
    const sanitizedError = rawMessage
      .replace(/\/app\/[^\s:]+/g, '[internal]')
      .replace(/\/root\/[^\s:]+/g, '[internal]')
      .replace(/\/home\/[^\s:]+/g, '[internal]');

    let status = error.status || 422;
    if (!error.status) {
      if (sanitizedError.includes('timed out')) {
        status = 504;
      } else if (sanitizedError.includes('queue limit') || sanitizedError.includes('busy')) {
        status = 429;
      } else if (sanitizedError.includes('unavailable') || sanitizedError.includes('failed closed')) {
        status = 503;
      }
    }

    return NextResponse.json(
      { error: sanitizedError },
      { status }
    );
  }
}
