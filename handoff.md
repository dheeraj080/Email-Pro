# Email.Pro - Project Handoff

## Overview
Email.Pro is a high-fidelity, code-first development workbench for building and previewing React Email templates with isolated, authoritative server rendering.

## Architecture & System State

### 1. Authoritative Server Rendering
* **No Browser Execution**: Untrusted template source is never compiled, evaluated, or executed within the browser client. All browser-side execution pathways (`renderEmailToReact`, `compileTemplate`, `getClientMockedComponents`, `new Function`, `eval`) have been decommissioned.
* **Server Pipeline**: Client keystrokes trigger a 400ms debounced request to `/api/render`. Next.js delegates via `rendererClient` to either an isolated container (`renderer/`) or a local disposable worker (`lib/local-disposable-renderer.ts`).
* **Frame Isolation**: Rendered HTML is returned as static markup and injected into a sandboxed `<iframe>` (`sandbox="allow-same-origin"`). Scripts cannot execute because `allow-scripts` is excluded.
* **Export Parity**: Live preview, clipboard HTML copy, single-file HTML download, and multi-file workspace ZIP export all route through the authoritative server renderer (`exportToHTML`).

### 2. Concurrency & Race Protection
* `renderSeqRef` in `hooks/use-email-editor.ts` tracks request ordering monotonically.
* Stale responses from slow or out-of-order compilation requests are discarded, preventing stale HTML, erroneous failure states, or outdated loading indicators from replacing active editor state.

### 3. Container & Worker Hardening
* **Disposable Workers**: Untrusted execution runs in disposable Node.js subprocesses terminated immediately after render or upon timeout (2500ms max).
* **Process & Network Sanitization**: Workers strip dangerous globals (`fetch`, `WebSocket`, `XMLHttpRequest`, `process.kill`, etc.) and block dynamic imports via customized loader hooks.
* **Container Hardening**: Docker definitions (`renderer/Dockerfile`, `docker-compose.yml`) specify non-root execution (UID 1001), read-only root filesystems, 64MB `tmpfs`, dropped capabilities, and strict CPU/memory limits.
* **Production Guardrails**: In `NODE_ENV=production`, `RENDERER_MODE=local` is blocked with `SECURITY_CONFIGURATION_ERROR`. Production safely defaults to `container` mode and fails closed if the container is unreachable.

### 4. Canonical Templates
All 8 canonical templates under `lib/templates/` compile and render via the authoritative pipeline:
1. `welcome` (Welcome Email)
2. `reset-password` (Reset Password)
3. `receipt` (Order Receipt)
4. `newsletter` (Weekly Newsletter)
5. `welcome-v2` (Resend Welcome)
6. `shipping-confirmation` (Shipping Tracking)
7. `tech-summit` (Tech Summit RSVP)
8. `legacy-html` (Raw HTML Template)

## Verification Suites

Run the following suites to validate system integrity:

```bash
# Linter and App Router build
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

## Known Limitations
* **Docker Runtime in Dev Sandbox**: Docker runtime isolation cannot be tested live in development environments where the Docker daemon is absent.
* **Hook Concurrency Testing**: Race protection is verified via algorithmic regression testing rather than mounted headless React DOM tests.
* **Local Renderer Dependencies**: `sucrase` and `@react-email/render` remain in root `package.json` to power the local disposable worker path during development.
