const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.mjs':  'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.mp4':  'video/mp4',
};

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

  fs.stat(filePath, (statErr, stat) => {
    if (!statErr && stat.isDirectory()) {
      if (!urlPath.endsWith('/')) {
        res.writeHead(301, { Location: urlPath + '/' });
        res.end();
        return;
      }
      filePath = path.join(filePath, 'index.html');
    }
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
