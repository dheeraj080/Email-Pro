import { fork, ChildProcess } from 'child_process';
import path from 'path';

export interface RenderRequest {
  id: string;
  code: string;
  templates?: any[];
  resolve: (html: string) => void;
  reject: (err: Error) => void;
  timeoutTimer?: NodeJS.Timeout;
}

const TIMEOUT_MS = 2500;
const MAX_CODE_LENGTH = 500_000; // 500 KB
const MAX_TEMPLATES_COUNT = 50;

class IsolatedRenderer {
  private worker: ChildProcess | null = null;
  private currentRequest: RenderRequest | null = null;
  private requestQueue: RenderRequest[] = [];
  private isSpawning: boolean = false;
  private isReady: boolean = false;
  private currentRequestId: number = 0;

  constructor() {
    this.spawnWorker();
  }

  private spawnWorker(): void {
    if (this.isSpawning) return;
    this.isSpawning = true;
    this.isReady = false;

    const workerScript = path.join(process.cwd(), 'lib', 'server-render-worker.mjs');

    // Strip environment to prevent leaking secrets (e.g. GEMINI_API_KEY)
    const safeEnv: NodeJS.ProcessEnv = {
      NODE_ENV: 'production',
      VERCEL_URL: 'react.email',
      PATH: process.env.PATH || '',
    };

    try {
      this.worker = fork(workerScript, [], {
        cwd: process.cwd(),
        env: safeEnv,
        execArgv: ['--max-old-space-size=128'],
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });

      this.worker.on('message', (msg: any) => {
        if (!msg || typeof msg !== 'object') return;

        if (msg.type === 'ready') {
          this.isReady = true;
          this.isSpawning = false;
          this.processNext();
          return;
        }

        if (this.currentRequest && msg.id === this.currentRequest.id) {
          const req = this.currentRequest;
          if (req.timeoutTimer) {
            clearTimeout(req.timeoutTimer);
          }
          this.currentRequest = null;

          if (msg.success) {
            req.resolve(msg.html);
          } else {
            req.reject(new Error(msg.error || 'Rendering failed'));
          }

          this.processNext();
        }
      });

      this.worker.on('error', (err) => {
        console.error('Isolated renderer worker error:', err.message);
      });

      this.worker.on('exit', (code, signal) => {
        this.handleWorkerDeath(`Worker exited with code ${code}, signal ${signal}`);
      });
    } catch (err: any) {
      console.error('Failed to spawn isolated renderer worker:', err.message);
      this.isSpawning = false;
    }
  }

  private handleWorkerDeath(reason: string): void {
    this.isReady = false;
    this.isSpawning = false;
    this.worker = null;

    if (this.currentRequest) {
      const req = this.currentRequest;
      if (req.timeoutTimer) {
        clearTimeout(req.timeoutTimer);
      }
      this.currentRequest = null;
      req.reject(new Error(`Renderer process terminated unexpectedly (${reason}).`));
    }

    // Respawn a fresh worker for remaining or future requests
    this.spawnWorker();
  }

  private processNext(): void {
    if (!this.isReady || !this.worker || this.currentRequest) {
      return;
    }

    if (this.requestQueue.length === 0) {
      return;
    }

    const next = this.requestQueue.shift()!;
    this.currentRequest = next;

    next.timeoutTimer = setTimeout(() => {
      if (this.currentRequest && this.currentRequest.id === next.id) {
        const timedOutReq = this.currentRequest;
        this.currentRequest = null;
        timedOutReq.reject(
          new Error(
            'Rendering timed out (maximum 2500ms exceeded). Check for infinite loops or heavy computation.'
          )
        );

        // Kill the unresponsive worker immediately
        if (this.worker) {
          try {
            this.worker.kill('SIGKILL');
          } catch {
            // Ignore
          }
        }
      }
    }, TIMEOUT_MS);

    try {
      this.worker.send({
        id: next.id,
        code: next.code,
        templates: next.templates,
      });
    } catch (err: any) {
      if (next.timeoutTimer) {
        clearTimeout(next.timeoutTimer);
      }
      this.currentRequest = null;
      next.reject(new Error('Failed to dispatch render job: ' + err.message));
      this.handleWorkerDeath('Send failure');
    }
  }

  public async render(code: string, templates: any[] = []): Promise<string> {
    if (code.length > MAX_CODE_LENGTH) {
      throw new Error(`Template code exceeds maximum size limit (${MAX_CODE_LENGTH / 1000}KB).`);
    }
    if (templates.length > MAX_TEMPLATES_COUNT) {
      throw new Error(`Templates count exceeds maximum limit (${MAX_TEMPLATES_COUNT}).`);
    }

    const id = `req_${++this.currentRequestId}_${Date.now()}`;

    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        id,
        code,
        templates,
        resolve,
        reject,
      });

      if (this.isReady && !this.currentRequest) {
        this.processNext();
      } else if (!this.worker && !this.isSpawning) {
        this.spawnWorker();
      }
    });
  }
}

// Attach to global singleton in development to prevent multiple worker processes on hot reloads
const globalForRenderer = globalThis as unknown as {
  __isolatedEmailRenderer?: IsolatedRenderer;
};

export const isolatedRenderer =
  globalForRenderer.__isolatedEmailRenderer || new IsolatedRenderer();

if (process.env.NODE_ENV !== 'production') {
  globalForRenderer.__isolatedEmailRenderer = isolatedRenderer;
}
