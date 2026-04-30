const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = 5000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json',
};

const COMPRESSIBLE = new Set([
  'text/html; charset=utf-8', 'text/css', 'application/javascript',
  'image/svg+xml', 'application/json', 'application/xml',
  'text/plain', 'application/manifest+json',
]);

const CACHE_IMMUTABLE = new Set(['.woff2', '.woff', '.png', '.jpg', '.jpeg', '.webp', '.ico']);
const CACHE_SHORT = new Set(['.html', '.css', '.js', '.svg']);

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(PUBLIC_DIR, urlPath);

  if (!path.extname(filePath)) {
    if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else {
      filePath = filePath + '.html';
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  const headers = { 'Content-Type': contentType };
  if (CACHE_IMMUTABLE.has(ext)) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (ext === '.html') {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
  } else if (CACHE_SHORT.has(ext)) {
    headers['Cache-Control'] = 'public, max-age=3600';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (COMPRESSIBLE.has(contentType) && acceptEncoding.includes('br')) {
      headers['Content-Encoding'] = 'br';
      headers['Vary'] = 'Accept-Encoding';
      zlib.brotliCompress(data, (err2, compressed) => {
        if (err2) {
          res.writeHead(200, headers);
          res.end(data);
        } else {
          res.writeHead(200, headers);
          res.end(compressed);
        }
      });
    } else if (COMPRESSIBLE.has(contentType) && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
      zlib.gzip(data, (err2, compressed) => {
        if (err2) {
          res.writeHead(200, headers);
          res.end(data);
        } else {
          res.writeHead(200, headers);
          res.end(compressed);
        }
      });
    } else {
      res.writeHead(200, headers);
      res.end(data);
    }
  });
}).listen(PORT, () => {
  console.log(`Static server running on http://localhost:${PORT}`);
});
