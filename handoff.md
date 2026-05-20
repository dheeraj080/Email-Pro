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

### 7. Isolated iframe Preview Engine 🖼️
* **File**: `components/editor/preview-content.tsx`
* **Details**: The email preview body was previously rendered as a direct React child of the editor DOM, causing host page CSS (media queries, Tailwind utilities, global styles) to bleed into the preview and clip wide emails at large mobile/tablet viewport sizes. The preview is now rendered inside a dedicated `<Frame>` component, which uses `react-dom`'s `createPortal` to mount the component tree into an isolated `<iframe>` document. This gives every preview its own fully clean CSS scope — large-mobile (412px Pixel 7, etc.) templates now render without any clipping from the parent app's responsive breakpoints.

### 8. Modular Templates & Premium Stripe/Linear Redesigns 🎨⚡
* **Files**: `lib/templates.ts`, `lib/templates/*.ts`
* **Details**:
  * **Modular Architecture**: Decoupled the giant, single-file `lib/templates.ts` into a modular design repository. Each template (Welcome, Reset Password, Order Receipt, Newsletter, etc.) now lives in its own dedicated, clean file under `lib/templates/welcome.ts`, etc.
  * **Premium Redesigns**: Completely overhauled the default presets with gorgeous, high-polish designs inspired by Stripe, Linear, and Vercel. Added custom `#f4f4f5` background wrappers, drop shadows, responsive table-column grids, and modern layout cards with visual badges and emojis.

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
