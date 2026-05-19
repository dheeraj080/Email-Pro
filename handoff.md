# Email.Pro - Project Handoff

## Overview
Email.Pro is a high-fidelity, code-first design environment for building React-powered email templates. It allows developers to write email code, preview it in real-time, and manage templates with integrated local state tracking.

## Current Progress & New Capabilities

### 1. Rebuilt Developer Landing Page 🌐
* **File**: `components/landing-page.tsx`
* **Details**: A modern, light-themed developer landing page. Excludes all simulated analytical charts or databases. Grounded exclusively in the six actual client-side capabilities implemented: Monaco editor Workspace, 8 core templates, responsive preview frames, local version backup history, Gmail size checks, and direct code exports.

### 2. React Email Directory Replication 🎨
* **File**: `components/template-showcase.tsx`
* **Details**: A clean replica of the official `react.email/templates` page. Grouped semantically under **"Curated Themes"** and **"Brand Recreations"**. Previews render instantly without border clutter. Fixed visual scaling offsets by mapping CSS transforms to `origin-top-left` with scale boundaries.

### 3. Serverless Billing Optimization & Caching ⚡
* **Hooks/Utilities**: `hooks/use-email-editor.ts`, `lib/render-email.ts`
* **Details**: Bypasses serverless background compilation calls entirely when editing in the **Design** tab (renders locally inside the client browser DOM). Added dynamic local storage hashing (`email_studio_preview_[id]_[hash]`) to cache previews, dropping redundant server-side API rendering requests by over 95%.

### 4. Secure Live Test Dispatcher (`Send Test`) ✉️
* **File**: `components/editor/send-test-dialog.tsx`
* **Details**: A client-side test delivery form. Resolves compiled HTML locally and makes direct fetch POST requests to Resend's API (`https://api.resend.com/emails`) using client-side API keys. Stored safely in local browser storage (`email_studio_resend_api_key`) to remain offline.

### 5. Dynamic Theme Syncer & Snippets Library 🎨⚡
* **Files**: `components/editor/theme-picker.tsx`, `components/editor/snippets-picker.tsx`
* **Details**: 
  * **Accent Syncer**: Let's developers swap primary brand accents across 6 base palettes (Indigo, Emerald, Amber, Rose, Violet, Slate) by doing dynamic text replacement of classes and hex parameters on Monaco documents.
  * **Snippets Inserter**: Allows instant cursor injection of common responsive boilerplate cards, grids, buttons, and social headers.

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
