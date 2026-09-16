import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_CODE_LENGTH = 500_000; // 500 KB
const MAX_TEMPLATES_COUNT = 50;
const MAX_OUTPUT_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_QUEUE_SIZE = 20;
const TIMEOUT_MS = 2500;
const MAX_CONCURRENT_WORKERS = 2;

export class RendererDispatcher {
  constructor() {
    this.activeWorkers = 0;
    this.queue = [];
    this.requestCounter = 0;
    this.workerPath = path.join(__dirname, 'worker.mjs');
  }

  get queueLength() {
    return this.queue.length;
  }

  async render(code, templates = []) {
    // 1. Validate input size
    if (typeof code !== 'string') {
      throw { status: 400, message: 'Valid code string is required' };
    }
    if (code.length > MAX_CODE_LENGTH) {
      throw {
        status: 413,
        message: `Template code exceeds maximum size limit (${MAX_CODE_LENGTH / 1000}KB).`,
      };
    }
    if (!Array.isArray(templates) || templates.length > MAX_TEMPLATES_COUNT) {
      throw {
        status: 400,
        message: `Templates count exceeds maximum limit (${MAX_TEMPLATES_COUNT}).`,
      };
    }

    // 2. Enforce queue bounds
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      console.warn(`[RENDERER] Queue limit exceeded (${this.queue.length}/${MAX_QUEUE_SIZE}). Rejecting request.`);
      throw {
        status: 429,
        message: 'Renderer queue limit exceeded (maximum 20 pending requests). Please retry shortly.',
      };
    }

    const id = `req_${++this.requestCounter}_${Date.now()}`;

    return new Promise((resolve, reject) => {
      this.queue.push({
        id,
        code,
        templates,
        resolve,
        reject,
      });

      this.processNext();
    });
  }

  processNext() {
    if (this.activeWorkers >= MAX_CONCURRENT_WORKERS || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.activeWorkers++;
    this.executeSingleWorker(job)
      .finally(() => {
        this.activeWorkers--;
        this.processNext();
      });
  }

  executeSingleWorker(job) {
    const { id, code, templates, resolve, reject } = job;
    const startTime = performance.now();

    console.log(`[RENDERER] [${id}] Processing render request (code_len=${code.length}, templates=${templates.length})`);

    return new Promise((done) => {
      let isSettled = false;
      let timeoutTimer = null;

      const safeEnv = {
        NODE_ENV: 'production',
        VERCEL_URL: 'react.email',
        PATH: process.env.PATH || '',
      };

      const worker = fork(this.workerPath, [], {
        cwd: __dirname,
        env: safeEnv,
        execArgv: ['--max-old-space-size=128'],
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      });

      const cleanup = () => {
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
          timeoutTimer = null;
        }
        try {
          if (!worker.killed) {
            worker.kill('SIGKILL');
          }
        } catch (e) {
          // Ignore
        }
        done();
      };

      const settle = (err, result) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();

        const duration = (performance.now() - startTime).toFixed(1);
        if (err) {
          console.error(`[RENDERER] [${id}] Render failed in ${duration}ms: ${err.message || err}`);
          reject(err);
        } else {
          console.log(`[RENDERER] [${id}] Render succeeded in ${duration}ms (output_len=${result.length})`);
          resolve(result);
        }
      };

      // Set hard timeout (2500ms)
      timeoutTimer = setTimeout(() => {
        console.warn(`[RENDERER] [${id}] Worker timed out after ${TIMEOUT_MS}ms. Killing via SIGKILL.`);
        settle({
          status: 504,
          message: `Rendering timed out (maximum ${TIMEOUT_MS}ms exceeded). Check for infinite loops or heavy computation.`,
        });
      }, TIMEOUT_MS);

      worker.on('message', (msg) => {
        if (!msg || typeof msg !== 'object') return;

        if (msg.type === 'ready') {
          // Worker is ready, dispatch payload
          try {
            worker.send({ id, code, templates });
          } catch (sendErr) {
            settle({ status: 500, message: 'Failed to send payload to worker: ' + sendErr.message });
          }
          return;
        }

        if (msg.id === id) {
          if (msg.success) {
            const html = msg.html || '';
            if (html.length > MAX_OUTPUT_SIZE) {
              settle({
                status: 413,
                message: `Rendered output exceeds maximum size limit (${MAX_OUTPUT_SIZE / 1024 / 1024}MB).`,
              });
              return;
            }
            settle(null, html);
          } else {
            settle({
              status: 422,
              message: msg.error || 'Rendering failed inside isolated worker.',
            });
          }
        }
      });

      worker.on('error', (workerErr) => {
        console.error(`[RENDERER] [${id}] Worker process error:`, workerErr.message);
        settle({
          status: 500,
          message: 'Renderer worker process encountered an error: ' + workerErr.message,
        });
      });

      worker.on('exit', (code, signal) => {
        if (!isSettled) {
          console.warn(`[RENDERER] [${id}] Worker exited unexpectedly (code=${code}, signal=${signal})`);
          settle({
            status: 500,
            message: `Renderer worker terminated unexpectedly (exit code ${code}, signal ${signal}).`,
          });
        }
      });
    });
  }
}

export const rendererDispatcher = new RendererDispatcher();
