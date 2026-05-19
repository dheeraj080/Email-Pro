# Email.Pro - Project Handoff

## Overview
Email.Pro is a high-fidelity, code-first design environment for building React-powered email templates. It allows developers to write email code, preview it in real-time, and manage templates with integrated analytics.

## Current Progress
- **Landing Page**: Implemented at `components/landing-page.tsx`.
- **Email Editor**: Core editing logic in `components/email-editor.tsx` and `components/editor/`. Uses Monaco Editor.
- **Template Management**: List and details view under `app/templates/`.
- **Real-time Rendering**: API route at `app/api/render` using `@react-email/render` and `sucrase`.
- **Analytics**: Dashboard component for tracking template performance at `components/analytics-dashboard.tsx`.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4
- **Email**: @react-email/components, @react-email/render
- **Animations**: motion (framer-motion)
- **Icons**: lucide-react
- **Editor**: @monaco-editor/react

## Critical Guidelines (See AGENTS.md)
- **No Destructive Operations**: Do not delete files or directories without permission.
- **Incremental Changes**: Maintain consistency; avoid major redesigns for small requests.
- **Safety First**: Use safer alternatives to recursive deletes.

## Pending Tasks
- Enhance template library with more pre-built options.
- Deepen analytics integration with real-world data providers.
- Improve state persistence for unsaved changes in the editor.
