import http from 'http';
import { rendererDispatcher } from './dispatcher.mjs';

const PORT = parseInt(process.env.RENDERER_PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const MAX_BODY_SIZE = 512 * 1024; // 512 KB

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(payload);
}

const server = http.createServer(async (req, res) => {
  // 1. Health check route
  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, {
      status: 'healthy',
      service: 'email-pro-renderer',
      uptime: Math.floor(process.uptime()),
      queued: rendererDispatcher.queueLength,
    });
  }

  // 2. Render route
  if (req.method === 'POST' && req.url === '/render') {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return sendJson(res, 415, {
        success: false,
        error: 'Content-Type must be application/json',
      });
    }

    let body = '';
    let bodyLength = 0;
    let tooLarge = false;

    req.on('data', (chunk) => {
      if (tooLarge) return;
      bodyLength += chunk.length;
      if (bodyLength > MAX_BODY_SIZE) {
        tooLarge = true;
        return sendJson(res, 413, {
          success: false,
          error: `Request payload exceeds maximum size limit (${MAX_BODY_SIZE / 1024}KB).`,
        });
      }
      body += chunk;
    });

    req.on('end', async () => {
      if (tooLarge) return;

      let parsed;
      try {
        parsed = JSON.parse(body || '{}');
      } catch (parseErr) {
        return sendJson(res, 400, {
          success: false,
          error: 'Invalid JSON payload in request body.',
        });
      }

      const { code, templates = [] } = parsed;

      try {
        const html = await rendererDispatcher.render(code, templates);
        return sendJson(res, 200, {
          success: true,
          html,
        });
      } catch (err) {
        const status = err.status || 422;
        const message = err.message || 'Rendering failed';
        return sendJson(res, status, {
          success: false,
          error: message,
        });
      }
    });

    return;
  }

  // 404 for any other route
  sendJson(res, 404, {
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[EMAIL-PRO-RENDERER] Dedicated secure renderer service listening on http://${HOST}:${PORT}`);
  console.log(`[EMAIL-PRO-RENDERER] Model: One Render = One Disposable Worker`);
});

// Graceful shutdown
function handleShutdown(signal) {
  console.log(`[EMAIL-PRO-RENDERER] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[EMAIL-PRO-RENDERER] Server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
