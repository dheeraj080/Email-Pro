# Email.Pro

**Email engineering, simplified.**

Email.Pro is a high-fidelity, code-first email design environment built for engineers and designers who want absolute precision. It bridges the gap between modern React development and the complex, archaic world of HTML email clients.

![Email Pro Preview](https://picsum.photos/seed/email-pro/1200/600)

## 🚀 Features

- **React-Powered Templates**: Build modular, reusable email components using `@react-email/components`.
- **Real-time Rendering Engine**: Sub-millisecond feedback loop powered by `Sucrase` and server-side rendering.
- **Smart Analytics Dashboard**: 
  - **Deliverability Audit**: Monitor template size (Gmail's 102KB limit), DOM complexity, and spam risk.
  - **Campaign Prediction**: Estimated open and click rates based on content heuristics.
  - **Content Inventory**: Automatic counts of links, images, and components.
- **Designer IDE**:
  - Split-pane editor with syntax highlighting (`prismjs`).
  - Responsive preview (Desktop/Mobile) with draggable resize handles.
  - Dark mode by default for focused engineering.
- **Production Ready**:
  - Automatic CSS inlining for maximum client compatibility.
  - One-click HTML export.
  - Autosave functionality using local storage.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (framer-motion)
- **Icons**: Lucide React
- **Email Engine**: `@react-email`
- **Compiler**: `Sucrase` (for instant JSX/TS transpilation)

## 📁 Project Structure

```text
├── app/
│   ├── api/render/      # Server-side email compilation API
│   ├── layout.tsx       # Root layout & font configuration
│   └── page.tsx         # Application entry point
├── components/
│   ├── email-editor.tsx # Main IDE component
│   ├── analytics-dashboard.tsx # Campaign insights UI
│   ├── template-showcase.tsx # Gallery of pre-built templates
│   └── landing-page.tsx # Swiss-minimal marketing page
├── lib/
│   ├── analytics-utils.ts # Heuristic analysis logic
│   ├── render-email.ts    # Transpilation & HTML generation
│   └── utils.ts           # Tailwind utility helpers
└── templates/           # Default email starting points
```

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🧪 Analytics Logic

The analytics engine performs a multi-pass audit of your template:
- **Size Check**: Direct byte-count monitoring to ensure you stay under the 102KB "clipping" threshold.
- **Complexity Analysis**: Analyzes DOM depth and node count to ensure performance across mobile clients.
- **Spam Heuristics**: Scans for aggressive marketing keywords and formatting that might trigger deliverability issues.
- **Readability Score**: An algorithmic assessment of visual density and layout balance.

## 📄 License

MIT © 2026 Email.Pro Lab
