import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mediaDevPlugin } from './scripts/media-dev-plugin.mjs'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { sitePages } from './src/data/site.js'
const legacyAliases = { name: 'legacy-html-aliases', configureServer(server) { server.middlewares.use((req, res, next) => { if (['/readwithlira.html', '/index.html'].includes(req.url?.split('?')[0])) req.url = '/'; next() }) } }
export default defineConfig({ plugins: [mediaDevPlugin(),{ name: 'utf8-llms', configureServer(server) { server.middlewares.use((req,res,next) => { if (req.url?.split('?')[0] === '/llms.txt') { res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end(readFileSync(resolve(server.config.root, 'public/llms.txt'), 'utf8')); return } next() }) }, configurePreviewServer(server) { server.middlewares.use((req,res,next) => { if (req.url?.split('?')[0] === '/llms.txt') { res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end(readFileSync(resolve(server.config.root, 'public/llms.txt'), 'utf8')); return } next() }) } }, legacyAliases, { name: 'static-page-preview', configurePreviewServer(server) { server.middlewares.use((req, res, next) => { const path = req.url?.split('?')[0]; if (path && path !== '/' && sitePages.some(page => page.path === path)) { const file = `${path}/index.html`; if (existsSync(resolve(server.config.root, server.config.build.outDir, '.' + file))) req.url = file } next() }) } }, vue()], server: { host: '127.0.0.1' }, preview: { host: '127.0.0.1' } })
