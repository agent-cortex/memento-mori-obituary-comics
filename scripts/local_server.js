import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = 5000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = url.pathname;

  // Intercept Vercel image optimization requests and map them to their local static source
  if (pathname === '/_vercel/image') {
    const targetUrl = url.searchParams.get('url');
    if (targetUrl) {
      pathname = decodeURIComponent(targetUrl);
    }
  }

  console.log(`${req.method} ${pathname}`);

  // Handle clean URLs and directory indices
  let filePath = path.join(ROOT, pathname);
  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch {
    // If not found directly, check if adding .html helps (cleanUrls)
    if (!path.extname(pathname)) {
      filePath += '.html';
    }
  }

  // Handle /media/* re-routing (mocking it to the local comics directory structure for dev ease)
  if (pathname.startsWith('/media/comics/')) {
    const comicPart = pathname.substring('/media/comics/'.length);
    filePath = path.join(ROOT, 'comics', comicPart);
  }

  try {
    const content = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Local development server is running on all interfaces at: http://0.0.0.0:${PORT}`);
  console.log('Serving Memento Mori Obituary Comics website...');
});
