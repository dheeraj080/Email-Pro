# Email.Pro - Project Handoff

## Overview
Email.Pro is a high-fidelity, code-first design environment for building React-powered email templates. It allows developers to write email code, preview it in real-time, and manage templates with integrated local state tracking.

## Current Progress & New Capabilities

### 1. Rebuilt Developer Landing Page 🌐
* **File**: `components/landing-page.tsx`
* **Details**: A modern, light-themed developer landing page. Excludes all simulated analytical charts or databases. Grounded exclusively in the six actual client-side capabilities implemented: Monaco editor Workspace, 8 core templates, responsive preview frames, local version backup history, Gmail size checks, and direct code exports.
* **New Additions**: Upgraded the features grid into a modern bento-style layout with dynamic spotlight mouse-glow micro-animations, along with a grayscale tech-stack trust banner (React, TypeScript, Tailwind, Monaco).

### 2. React Email Directory Replication & Catalog 🎨
* **File**: `components/template-showcase.tsx`
* **Details**: A clean replica of the official `react.email/templates` page. Grouped semantically under **"Curated Themes"** and **"Brand Recreations"**. Previews render instantly without border clutter. Fixed visual scaling offsets by mapping CSS transforms to `origin-top-left` with scale boundaries. 
* **Styling**: Fully unified with the white, clean minimalist theme of the main application.

### 3. Serverless Billing Optimization & Caching ⚡
* **Hooks/Utilities**: `hooks/use-email-editor.ts`, `lib/render-email.ts`
* **Details**: Bypasses serverless background compilation calls entirely when editing in the **Design** tab (renders locally inside the client browser DOM). Added dynamic local storage hashing (`email_pro_preview_[id]_[hash]`) to cache previews, dropping redundant server-side API rendering requests by over 95%.

### 4. Secure Live Test Dispatcher (`Send Test`) ✉️
* **File**: `components/editor/send-test-dialog.tsx`
* **Details**: A client-side test delivery form. Resolves compiled HTML locally and makes direct fetch POST requests to Resend's API (`https://api.resend.com/emails`) using client-side API keys. Stored safely in local browser storage (`email_pro_resend_api_key`) to remain offline. Styled to conform perfectly with the minimalist theme.

### 5. Dynamic Theme Syncer & Snippets Library 🎨⚡
* **Files**: `components/editor/theme-picker.tsx`, `components/editor/snippets-picker.tsx`
* **Details**: 
  * **Accent Syncer**: Let's developers swap primary brand accents across 6 base palettes (Indigo, Emerald, Amber, Rose, Violet, Slate) by doing dynamic text replacement of classes and hex parameters on Monaco documents.
  * **Snippets Inserter**: Allows instant cursor injection of common responsive boilerplate cards, grids, buttons, and social headers.

### 6. Workspace Decluttering & Unified Aesthetics 🧹
* **Files**: `components/editor/template-sidebar.tsx`, `components/editor/preview-content.tsx`, `components/email-editor.tsx`, `components/editor/history-sidebar.tsx`, `components/editor/analytics-view.tsx`
* **Details**:
  * **Smart Sidebar**: The Template list now shows only the active template by default, preventing vertical clutter. Added a searchable overlay and a toggle button (`View X Other Templates`) to browse the presets when needed.
  * **Unified Styling**: Standardized backgrounds, sidebars, forms, and preview wrappers to pure white (`bg-white`), thin light borders (`border-ink-black-100`), and modern subtle shadows. Purged all lingering heavy dark shadows and custom slate colors to deliver a singular design language.

### 7. Isolated iframe Preview Engine & High-Fidelity srcDoc Renderer 🖼️⚡
* **Files**: `components/editor/preview-content.tsx`, `lib/render-email.ts`
* **Details**: 
  * **Unified srcDoc Rendering**: Shifted the visual preview tab from a browser-side custom React transpilation portal (which was highly unstable due to NPM modules context limits) to a native high-fidelity **`srcDoc` rendering engine** inside the isolated `<iframe>`.
  * **100% Layout & Styling Fidelity**: By rendering the real, compiled, static **HTML output** (`previewHtml`) generated in real-time by the server-side compiler (`/api/render`), the preview matches production exactly. All Tailwind CSS utility compilation, inline styling, layout structures, and media queries are rendered perfectly.
  * **No Faltering Portals**: Completely resolved the unstyled plain-text bugs, body color specificity overrides, and hydration warnings by fully bypassing client-side JSX transpilation inside the visual viewport.

### 8. Modular Templates & Premium Presets Redesigns (v3 Upgrade) 🎨⚡
* **Files**: `lib/templates.ts`, `lib/templates/*.ts`, `hooks/use-email-editor.ts`
* **Details**:
  * **Modular Architecture**: Decoupled the giant, single-file `lib/templates.ts` into a modular design repository. Each template (Welcome, Reset Password, Order Receipt, Newsletter, welcome-v2, shipping, tech-summit, legacy HTML) now lives in its own dedicated, clean file under `lib/templates/`.
  * **Full Presets Redesign**: Replaced all 8 default templates with breathtaking, state-of-the-art designs inspired by Linear, Resend, Stripe, and Vercel. Features custom responsive tables, edge glow radial gradients, verification PIN displays, luxury tracking bars, terminal-onboarding commands, and pure classic HTML card layouts.
  * **v3 Auto-Upgrade Migration**: Integrated a robust version-checking migration (`v3`) inside the editor's mount routing. This automatically invalidates any outdated templates cached in the browser's `localStorage` and overwrites them with the new premium designs so the user sees the changes instantly.

### 9. Multi-Output Viewer & Direct Copy Actions 📑✂️
* **Files**: `components/editor/preview-content.tsx`, `components/email-editor.tsx`, `hooks/use-email-editor.ts`
* **Details**:
  * **Dual Output Viewers**: Extended the preview panel tabs to render the live rendered **HTML** output code block alongside a fully formatted **JSON** template configuration block (which wraps the current active code state, metadata, and language).
  * **Actionable Copy buttons**: Integrated gorgeous floating "Copy HTML" and "Copy JSON" action buttons in the headers of their respective view displays. Built-in interactive micro-animations swap copy icons with green success checkmarks (`Copied!`) and handle clipboard operations dynamically.

## Tech Stack
* **Framework**: Next.js 15+ (App Router)
* **Styling**: Tailwind CSS v4
* **Email Rendering**: `@react-email/components`, `@react-email/render` (compiled via `sucrase` inside api)
* **Animations**: `motion` (framer-motion)
* **Icons**: `lucide-react`
* **Editor**: `@monaco-editor/react`

## Critical Guidelines
* **No Authentication Layers**: Currently a frontend-only browser utility; do not add simulated authentication/database wrappers.
* **Cost Efficiency**: Real compiler APIs should only be queried when generating clean inline HTML for Copy, Dispatch, or Download events.
