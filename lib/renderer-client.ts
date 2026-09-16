import { localDisposableRenderer } from './local-disposable-renderer';

export interface RendererClientConfig {
  mode: 'container' | 'local';
  rendererUrl: string;
}

/**
 * Resolves the renderer configuration based on environment variables.
 * Enforces strict fail-closed security in production:
 * - NODE_ENV=production + RENDERER_MODE=local -> FAILS CLOSED (throws)
 * - NODE_ENV=production + RENDERER_MODE=invalid -> FAILS CLOSED (throws)
 * - NODE_ENV=production + (missing or RENDERER_MODE=container) -> container mode
 * - Development -> permits local or container
 */
export function resolveConfig(
  nodeEnv: string | undefined = process.env.NODE_ENV,
  rendererMode: string | undefined = process.env.RENDERER_MODE,
  rendererUrlInput: string | undefined = process.env.RENDERER_URL
): RendererClientConfig {
  const envMode = rendererMode ? rendererMode.trim().toLowerCase() : undefined;
  const rendererUrl = rendererUrlInput || 'http://localhost:3001';

  // Production MUST never permit local renderer execution under any circumstances
  if (nodeEnv === 'production') {
    if (envMode === 'local') {
      throw new Error(
        'SECURITY_CONFIGURATION_ERROR: RENDERER_MODE=local is strictly forbidden when NODE_ENV=production. Local renderer execution cannot be used in production. Configure RENDERER_MODE=container.'
      );
    }
    if (envMode && envMode !== 'container') {
      throw new Error(
        `SECURITY_CONFIGURATION_ERROR: Invalid RENDERER_MODE "${rendererMode}" in production. Must be "container" or omitted (defaults to container).`
      );
    }
    // Production defaults to secure container mode
    return {
      mode: 'container',
      rendererUrl,
    };
  }

  // Non-production environment checks
  if (envMode && envMode !== 'container' && envMode !== 'local') {
    throw new Error(
      `CONFIGURATION_ERROR: Invalid RENDERER_MODE "${rendererMode}". Mode must be "container" or "local".`
    );
  }

  // Development defaults to container if explicitly requested or RENDERER_URL is provided, otherwise local
  if (envMode === 'container' || (rendererUrlInput && envMode !== 'local')) {
    return {
      mode: 'container',
      rendererUrl,
    };
  }

  return {
    mode: envMode === 'container' ? 'container' : 'local',
    rendererUrl,
  };
}

let loggedBanner = false;

export class RendererClient {
  private config: RendererClientConfig;

  constructor() {
    this.config = resolveConfig();
    this.logStartupBanner();
  }

  private logStartupBanner() {
    if (loggedBanner) return;
    loggedBanner = true;

    if (this.config.mode === 'container') {
      console.log(`[RENDERER-CLIENT] Mode: CONTAINER (${this.config.rendererUrl}). Fail-closed security active.`);
    } else {
      console.warn(
        `[RENDERER-CLIENT] Mode: LOCAL. Running with local disposable workers. Set RENDERER_MODE=container for production container isolation.`
      );
    }
  }

  public get mode(): 'container' | 'local' {
    return this.config.mode;
  }

  public async render(code: string, templates: any[] = []): Promise<string> {
    if (this.config.mode === 'container') {
      return this.renderViaContainer(code, templates);
    }
    return this.renderViaLocal(code, templates);
  }

  private async renderViaContainer(code: string, templates: any[] = []): Promise<string> {
    const endpoint = `${this.config.rendererUrl.replace(/\/+$/, '')}/render`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, templates }),
        signal: AbortSignal.timeout(3500),
      });
    } catch (networkError: any) {
      console.error('[RENDERER-CLIENT] Container connection failed:', networkError.message);
      // Production fail-closed: Do NOT fall back to local execution!
      throw new Error('Renderer service is unavailable. Rendering failed closed for security.');
    }

    let payload: any = {};
    try {
      payload = await response.json();
    } catch (parseErr) {
      throw new Error(`Renderer returned invalid response (HTTP ${response.status}).`);
    }

    if (!response.ok || !payload.success) {
      const errorMsg = payload.error || `Renderer failed with status ${response.status}.`;
      const err = new Error(errorMsg) as any;
      err.status = response.status;
      throw err;
    }

    return payload.html;
  }

  private async renderViaLocal(code: string, templates: any[] = []): Promise<string> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SECURITY_VIOLATION: Local renderer execution is strictly forbidden in production. Rendering aborted.'
      );
    }
    return localDisposableRenderer.render(code, templates);
  }
}

export const rendererClient = new RendererClient();
