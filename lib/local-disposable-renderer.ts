import { fork } from 'child_process';
import path from 'path';

const MAX_CODE_LENGTH = 500_000;
const MAX_TEMPLATES_COUNT = 50;
const TIMEOUT_MS = 2500;

export class LocalDisposableRenderer {
  private workerScript = path.join(process.cwd(), 'renderer', 'worker.mjs');

  public async render(code: string, templates: any[] = []): Promise<string> {
    if (code.length > MAX_CODE_LENGTH) {
      throw new Error(`Template code exceeds maximum size limit (${MAX_CODE_LENGTH / 1000}KB).`);
    }
    if (templates.length > MAX_TEMPLATES_COUNT) {
      throw new Error(`Templates count exceeds maximum limit (${MAX_TEMPLATES_COUNT}).`);
    }

    const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return new Promise((resolve, reject) => {
      let isSettled = false;
      let timer: NodeJS.Timeout | null = null;

      const safeEnv: NodeJS.ProcessEnv = {
        NODE_ENV: 'production',
        VERCEL_URL: 'react.email',
        PATH: process.env.PATH || '',
      };

      const worker = fork(this.workerScript, [], {
        cwd: process.cwd(),
        env: safeEnv,
        execArgv: ['--max-old-space-size=128'],
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });

      const cleanup = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        try {
          if (!worker.killed) {
            worker.kill('SIGKILL');
          }
        } catch {
          // Ignore
        }
      };

      const settle = (err: Error | null, result?: string) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        if (err) {
          reject(err);
        } else {
          resolve(result || '');
        }
      };

      timer = setTimeout(() => {
        settle(
          new Error(
            `Rendering timed out (maximum ${TIMEOUT_MS}ms exceeded). Check for infinite loops or heavy computation.`
          )
        );
      }, TIMEOUT_MS);

      worker.on('message', (msg: any) => {
        if (!msg || typeof msg !== 'object') return;

        if (msg.type === 'ready') {
          try {
            worker.send({ id, code, templates });
          } catch (e: any) {
            settle(new Error('Failed to dispatch render job: ' + e.message));
          }
          return;
        }

        if (msg.id === id) {
          if (msg.success) {
            settle(null, msg.html);
          } else {
            settle(new Error(msg.error || 'Rendering failed inside local disposable worker.'));
          }
        }
      });

      worker.on('error', (err) => {
        settle(new Error('Local worker process encountered an error: ' + err.message));
      });

      worker.on('exit', (code, signal) => {
        if (!isSettled) {
          settle(new Error(`Local worker process terminated unexpectedly (code ${code}, signal ${signal}).`));
        }
      });
    });
  }
}

export const localDisposableRenderer = new LocalDisposableRenderer();
