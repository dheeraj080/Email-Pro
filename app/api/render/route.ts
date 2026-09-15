import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import * as EmailComponents from '@react-email/components';
import { isRawHtml, compileEmailElement } from '@/lib/template-compiler';

export async function POST(req: Request) {
  try {
    const { code, language, templates = [] } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (language === 'html' || isRawHtml(code)) {
      return NextResponse.json({ html: code });
    }

    const element = compileEmailElement(code, {
      emailComponents: EmailComponents,
      templates,
    });

    if (!element) {
      throw new Error('Could not find a valid React component in the provided code.');
    }

    const html = await render(element);
    return NextResponse.json({ html });
  } catch (error: any) {
    console.error('Render error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to render email template' },
      { status: 500 }
    );
  }
}
