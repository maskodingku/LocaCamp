import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000
const DEPLOY_DIR = path.join(__dirname, 'siap-deploy')

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  // Normalize and sanitize requested URL path
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  let reqPath = decodeURIComponent(parsedUrl.pathname)

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html'
  }

  // Prevent directory traversal
  let filePath = path.join(DEPLOY_DIR, path.normalize(reqPath).replace(/^(\.\.[/\\])+/, ''))

  // Check if file exists, if not fallback to index.html for SPA routing
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DEPLOY_DIR, 'index.html')
  }

  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end(`Internal Server Error: ${err.message}`)
      return
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(content)
  })
})

server.listen(PORT, () => {
  console.log('----------------------------------------------------')
  console.log(`📸 LocaCamp Local Server (ESM) Active!`)
  console.log(`🚀 Serving: ${DEPLOY_DIR}`)
  console.log(`🌐 Local URL: http://localhost:${PORT}`)
  console.log('----------------------------------------------------')
})
