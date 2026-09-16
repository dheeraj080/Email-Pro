# Email.Pro

**High-fidelity, code-first email template development workbench with isolated authoritative server rendering.**

Email.Pro is a developer-focused engineering workbench designed for building, testing, and rendering pixel-perfect React Email templates. It bridges the gap between modern React development and archaic email client HTML layouts through isolated server-side rendering, real-time deliverability diagnostics, and multi-template workspace management.

---

## 🏛️ Rendering Architecture

Email.Pro employs an **authoritative server-side rendering model**. The client browser never executes untrusted user template code.

```
Browser (Editor / Actions)
       │
       ▼  HTTP POST (400ms debounced)
Next.js API Route (/api/render)
       │
       ▼  renderer-client
Isolated Renderer (Container / Disposable Worker)
       │
       ▼  @react-email/render + Sucrase Transpilation
Generated HTML Output
       │
       ▼  HTTP 200 JSON { html }
Sandboxed Preview Frame (<iframe sandbox="allow-same-origin" srcDoc={html}>)
```

### 1. Rendering Pipeline
* **No Browser-Side Execution**: The client browser does not execute, compile, or evaluate template source code. Browser-side compilation, `new Function()`, and `eval()` are completely removed from all client paths.
* **Authoritative Server Path**: All template compilation runs through `/api/render`, which delegates to the isolated renderer subsystem.
* **Worker Lifecycle**: Untrusted template code is executed inside a dedicated, disposable worker process per render request. Workers are terminated after each render or upon error.

### 2. Preview System
* Preview is rendered by streaming server-compiled HTML directly into a sandboxed `<iframe>` (`sandbox="allow-same-origin"`).
* Script execution (`<script>` tags, inline event handlers) within templates is blocked by the iframe sandbox since `allow-scripts` is omitted.
* UI updates are debounced by 400ms to throttle server requests, with monotonic sequence tracking (`renderSeqRef`) to discard stale, out-of-order responses.

### 3. Export Parity
* **Live Preview**, **Copy HTML**, **HTML File Download**, and **Workspace ZIP Export** all invoke the authoritative server renderer (`exportToHTML` -> `/api/render`).
* There is no client/server rendering split or client-side fast-path.

---

## 🔒 Security Model

### Code-Level Verified Protections
* **Zero Client Evaluation**: Browser bundles contain zero dynamic evaluation primitives (`eval`, `new Function`, `Function`).
* **Disposable Worker per Render**: Every render runs in a separate process that is terminated immediately upon completion.
* **Prototype Pollution Resistance**: Cross-render pollution of `Object.prototype`, `Array.prototype`, and `globalThis` is prevented.
* **Network & Process Stripping**: Workers strip outbound network APIs (`fetch`, `WebSocket`, `XMLHttpRequest`) and replace the Node.js `process` object with an immutable safe mock.
* **Dynamic Import Interception**: Custom module loaders block arbitrary dynamic `import(...)` calls.
* **Resource Bounds**:
  * Input size capped at 500KB.
  * Render execution strictly timed out at 2500ms (prevents infinite loops).
  * Worker heap limited to 128MB (`--max-old-space-size=128`).
* **Error Sanitization**: API responses sanitize internal filesystem paths (`/app/`, `/root/`, `/home/`) before returning error messages to clients.

### Container Runtime Configuration
The dedicated container renderer (`renderer/`) is configured with the following defense-in-depth settings:
* **Non-Root Execution**: Runs under unprivileged UID/GID 1001.
* **Read-Only Root Filesystem**: `read_only: true` in container orchestration.
* **Temporary Storage**: 64MB `tmpfs` mounted with `noexec,nosuid` at `/tmp`.
* **Privilege Reduction**: Linux capabilities dropped (`cap_drop: ALL`) and `no-new-privileges: true`.
* **Network Isolation**: Placed on an internal Docker network with no direct public ingress.
* *Note*: Container isolation is configured with these controls; runtime verification depends on the deployment environment.

---

## ⚙️ Development vs. Production Configuration

Configuration is managed via environment variables:

| Variable | Values | Description |
| :--- | :--- | :--- |
| `RENDERER_MODE` | `container` \| `local` | **Production**: Must be `container`. Setting `local` in production immediately throws `SECURITY_CONFIGURATION_ERROR`. Defaults safely to `container` if omitted.<br>**Development**: Accepts `local` (in-process worker) or `container`. |
| `RENDERER_URL` | `http://...` | Endpoint of the containerized renderer (default: `http://localhost:3001` or `http://renderer:3001`). |
| `GEMINI_API_KEY` | string | Optional server-side API key for AI-assisted features. |

### Production Fail-Closed Behavior
There is **no automatic fallback** from container to local mode in production. If the container renderer is unreachable in production, requests fail closed with HTTP 503 rather than executing untrusted code on the main web host.

---

## ⚠️ Known Limitations
* **Docker Runtime in Dev Sandbox**: Docker runtime isolation has not been independently verified in the current development sandbox because the Docker daemon is unavailable in this environment.
* **Race Condition Regression**: Concurrency race protection is verified via an algorithm-level sequence regression suite rather than a headless React DOM concurrency test.
* **Preview/Export Parity**: Verified via static source tracing and integration endpoint tests.

---

## 🧪 Verification & Testing Commands

To run validation and test suites against the application:

```bash
# Code quality and App Router build
npm run lint
npm run build

# Integration tests against live server (/api/render)
node scripts/test-secure-renderer.mjs

# Adversarial AST and sandbox escape test suite
node scripts/test-adversarial-audit.mjs

# Process boundary isolation tests
node scripts/test-security-boundary.mjs

# Phase 10 API edge cases, race simulation, and client bundle audit
node scripts/test-phase10-regression.mjs
```

---

## 📁 Key File Structure

```text
├── app/
│   ├── api/render/route.ts        # Authoritative Next.js render endpoint
│   ├── layout.tsx                 # Root document layout
│   └── page.tsx                   # Main application entry point
├── components/
│   ├── email-editor.tsx           # Main editor coordinator
│   └── editor/
│       ├── preview-content.tsx    # Sandboxed iframe preview (<iframe srcDoc>)
│       ├── editor-content.tsx     # Monaco code editor
│       └── template-sidebar.tsx   # Template workspace selector
├── hooks/
│   └── use-email-editor.ts        # Editor state, 400ms debounce, renderSeqRef
├── lib/
│   ├── renderer-client.ts         # Dispatches to container or local disposable worker
│   ├── local-disposable-renderer.ts # Disposable worker spawner for local dev
│   ├── render-email.ts            # Client HTTP caller for /api/render
│   ├── template-compiler.ts       # Server-side module transpilation & resolution
│   └── templates/                 # 8 canonical email templates
├── renderer/                      # Isolated container renderer service
│   ├── Dockerfile                 # Hardened non-root container definition
│   ├── server.mjs                 # Fastify HTTP microservice
│   ├── dispatcher.mjs             # Bounded concurrency queue manager
│   └── worker.mjs                 # Isolated per-render worker script
└── scripts/                       # Security, regression, and validation test suites
```

---

## 📄 License

MIT © 2026 Email.Pro Lab
