# Email.Pro

**High-fidelity, code-first email template development workbench.**

Email.Pro is a premium, developer-focused engineering workbench designed for building, testing, and rendering pixel-perfect React Email templates. It bridges the gap between modern React development and archaic email client HTML layouts by combining a live browser-simulated editor, multi-file sandboxed compilation, and real-time deliverability diagnostics.


---

## ✨ Core Features & Enhancements

### 1. ⚙️ Multi-File Sandboxed Compiler Engine
*   **Dynamic Module Linking**: The server-side compiler (`app/api/render/route.ts`) recursively resolves and compiles relative imports (e.g. `import { ... } from './another-template'`) from the active workspace template registry.
*   **Hermetic Sandboxing**: Compiles JSX/TSX modules into a custom IIFE scope using a sandboxed `moduleCache` and dependency linking resolver.
*   **High-Fidelity Theme Fallback**: Automatically intercepts official Resend canary components (such as `/theme` and `/theme-fonts`), dynamically injecting **Inter font families** and standard system design tokens to prevent unstyled layouts.

### 2. ⚡ Automated Hybrid Preview Hot-Swap
*   **Zero-Latency Typing Feedback**: The visual designer instantly displays visual edits via a fast browser portal (`previewComponent`), eliminating input delay and keeping keystrokes fully synchronized.
*   **Pixel-Perfect Production Check**: The editor coordinates a **500ms debounced background compiler** (`isDirty` flag) to compile the full template stack on the server side and hot-swaps the layout into the production-accurate HTML `srcDoc` preview when compilation finishes.

### 3. 📂 Workspace & Registry Controls
*   **Persistent Custom Templates**: Create new templates in `.html` or `.tsx` formats, synchronized in real-time with browser local storage.
*   **Premium Interactive Sidebar**: A fully-functional file management bar featuring responsive search query filtering, active templates, and a crimson hover-triggered **trash deletion action** with active-reflow safety bounds.
*   **Dynamic CDN Asset Auto-Resolver**: Automatically intercept and mock `process.env.VERCEL_URL` environment parameters as `react.email` in sandboxed workspaces, allowing all relative static asset images to resolve instantly in the local preview.

### 4. 📊 Deliverability & Campaign Analytics
*   **Gmail Clipping Warnings**: Visual deliverability safeguards warning you if compiled email byte sizes exceed Gmail's 102KB threshold.
*   **Complexity Diagnostics**: Automated tracking of DOM depth, interactive links, image metrics, and structural layouts.
*   **Spam Key Performance Indicators**: Heuristics scanning body content for high-risk promotional triggers and aggressive sales verbs.

---

## 🛠️ Architecture & Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Animations**: Motion (framer-motion)
*   **Icons**: Lucide React
*   **Email Pipeline**: `@react-email/components` & `@react-email/render`
*   **Sandboxing & Transpilation**: Sucrase (for high-speed JSX/TSX evaluation)

---

## 📁 Key File Structure

```text
├── app/
│   ├── api/render/      # Server-side multi-file JSX compiler & link resolver
│   ├── layout.tsx       # Root document layout & theme configuration
│   └── page.tsx         # Main entry page
├── components/
│   ├── email-editor.tsx # IDE layout, panel divisions, & hook coordinator
│   └── editor/
│       ├── template-sidebar.tsx # Workspace list, search, template addition, & delete actions
│       ├── preview-content.tsx  # Browser preview window, viewport controls, & JSON/HTML copy
│       └── editor-content.tsx   # Code editor workspace with Monaco/Prism styling
├── hooks/
│   └── use-email-editor.ts  # Workspace template registry state, compilation debouncer, & actions
├── lib/
│   ├── render-email.ts    # Browser-side JSX compilation & component builder
│   ├── analytics-utils.ts # Heuristics for spam scoring, readability, & metrics
│   └── types.ts           # Shared state definitions & template schemas
```

---

## 🚦 Getting Started

1.  **Install Workspace Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Workbench**:
    ```bash
    npm run dev
    ```

3.  **Build Production Asset Bundles**:
    ```bash
    npm run build
    ```

---

## 📄 License

MIT © 2026 Email.Pro Lab
