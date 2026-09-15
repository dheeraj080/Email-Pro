import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentCode, actionType, userApiKey } = await req.json();

    if (!prompt && !actionType) {
      return NextResponse.json({ error: 'Prompt or action type is required' }, { status: 400 });
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Gemini API Key is missing. Please enter your Gemini API key in the AI Copilot settings.' 
      }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let systemInstruction = `
You are an expert Email Developer specializing in @react-email/components and high-conversion responsive email design.
Your task is to generate or refactor clean, valid, production-ready React Email (TSX) code.

Guidelines:
1. Use imports from '@react-email/components' like:
   import { Html, Head, Preview, Body, Container, Section, Row, Column, Text, Button, Img, Heading, Hr, Link } from '@react-email/components';
   import * as React from 'react';
2. Always export a default React component (e.g. export default function EmailTemplate() { ... }).
3. Ensure inline styling and Tailwind / React Email style objects use web-safe fonts like Arial, Inter, system-ui, sans-serif.
4. Output ONLY valid TypeScript/JSX code. Do not wrap in markdown text explanations outside code blocks if possible.
5. Code must be completely self-contained and free of broken external component references.
`;

    let userPrompt = '';

    if (actionType === 'add_discount') {
      userPrompt = `Modify the following React Email component code to insert a stylized "SPECIAL 20% DISCOUNT CODE" box with a promo code and call to action button.
Current Code:
\`\`\`tsx
${currentCode || ''}
\`\`\``;
    } else if (actionType === 'fix_dark_mode') {
      userPrompt = `Optimize the following React Email code for client Dark Mode rendering (ensure high-contrast text, clear container backgrounds, and fallback styles for Outlook/Apple Mail).
Current Code:
\`\`\`tsx
${currentCode || ''}
\`\`\``;
    } else if (actionType === 'add_social_footer') {
      userPrompt = `Add a clean, modern email footer with social links, unsubscribe link, copyright notice, and company address to the following template code.
Current Code:
\`\`\`tsx
${currentCode || ''}
\`\`\``;
    } else if (currentCode && currentCode.trim().length > 20) {
      userPrompt = `Refactor or enhance the following React Email code based on this instruction: "${prompt}"

Current Code:
\`\`\`tsx
${currentCode}
\`\`\``;
    } else {
      userPrompt = `Create a brand new React Email template (TSX) matching this prompt: "${prompt}". Make it visually stunning, clean, responsive, and well-structured.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    let generatedText = response.text || '';

    // Clean up markdown code fences if present
    if (generatedText.includes('```')) {
      const codeMatch = generatedText.match(/```(?:tsx|jsx|typescript|javascript)?\n([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        generatedText = codeMatch[1].trim();
      } else {
        generatedText = generatedText.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
      }
    }

    return NextResponse.json({ code: generatedText });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate email template' },
      { status: 500 }
    );
  }
}
