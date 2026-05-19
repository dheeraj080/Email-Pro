'use client';

import React from 'react';
import { PlusSquare, Copy, AlignLeft, Columns2, ImageIcon, Quote, Share2, SeparatorHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EMAIL_SNIPPETS = [
  {
    name: 'CTA Button',
    icon: Copy,
    description: 'Clean padded responsive button',
    code: `<Button\n  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg text-center inline-block"\n  href="https://example.com"\n>\n  Get Started\n</Button>`
  },
  {
    name: '2-Column Grid',
    icon: Columns2,
    description: 'Responsive double columns layout',
    code: `<Section className="my-6">\n  <Row>\n    <Column className="w-1/2 pr-3">\n      <Text className="text-slate-700 text-sm font-semibold m-0">Left Heading</Text>\n      <Text className="text-slate-500 text-xs mt-1 leading-relaxed m-0">Responsive text content goes here.</Text>\n    </Column>\n    <Column className="w-1/2 pl-3">\n      <Text className="text-slate-700 text-sm font-semibold m-0">Right Heading</Text>\n      <Text className="text-slate-500 text-xs mt-1 leading-relaxed m-0">Responsive text content goes here.</Text>\n    </Column>\n  </Row>\n</Section>`
  },
  {
    name: 'Quote Callout',
    icon: Quote,
    description: 'Highlighted quotation section',
    code: `<Section className="bg-slate-50 border-l-4 border-indigo-600 rounded-r-lg p-5 my-6">\n  <Text className="text-slate-600 italic text-sm leading-relaxed m-0">\n    "Design is not just what it looks like and feels like. Design is how it works."\n  </Text>\n  <Text className="text-slate-500 text-xs font-bold mt-2.5 m-0">— Steve Jobs</Text>\n</Section>`
  },
  {
    name: 'Banner Image',
    icon: ImageIcon,
    description: 'Responsive visual cover image',
    code: `<Img\n  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop"\n  alt="Feature Banner"\n  width="100%"\n  className="rounded-xl object-cover my-6"\n/>`
  },
  {
    name: 'Divider Line',
    icon: SeparatorHorizontal,
    description: 'Subtle separator layout',
    code: `<Hr className="border-slate-200 my-6" />`
  },
  {
    name: 'Social Links',
    icon: Share2,
    description: 'Footer network redirection row',
    code: `<Row className="my-4 text-center">\n  <Column>\n    <Link href="#" className="text-indigo-600 text-xs font-semibold mx-2 underline">Twitter</Link>\n    <Link href="#" className="text-indigo-600 text-xs font-semibold mx-2 underline">GitHub</Link>\n    <Link href="#" className="text-indigo-600 text-xs font-semibold mx-2 underline">LinkedIn</Link>\n  </Column>\n</Row>`
  }
];

interface SnippetsPickerProps {
  onInsert: (snippetCode: string) => void;
}

export function SnippetsPicker({ onInsert }: SnippetsPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectSnippet = (code: string) => {
    onInsert(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-ink-black-100 bg-white hover:bg-alabaster-grey-100 hover:text-ink-black-900 transition-all text-[10px] font-bold uppercase tracking-widest text-ink-black-400 shadow-sm",
          isOpen && "border-slate-350 text-slate-800"
        )}
        title="Insert pre-designed visual email block snippets at cursor"
      >
        <PlusSquare className="w-3.5 h-3.5" />
        <span>Insert</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 z-[200] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 mb-2">Boilerplate Snippets</div>
          <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
            {EMAIL_SNIPPETS.map((snippet) => (
              <button
                key={snippet.name}
                onClick={() => handleSelectSnippet(snippet.code)}
                className="w-full p-2 rounded-lg border border-slate-50 hover:border-slate-200/60 bg-slate-50/50 hover:bg-slate-50 flex items-start gap-2.5 transition-all text-left group"
              >
                <div className="w-7 h-7 rounded-md bg-white border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-slate-800 shadow-sm shrink-0">
                  <snippet.icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="font-bold text-[10px] text-slate-700 tracking-tight leading-none group-hover:text-slate-900 mt-0.5">{snippet.name}</h5>
                  <p className="text-[8px] text-slate-400 font-semibold mt-1 leading-none">{snippet.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
