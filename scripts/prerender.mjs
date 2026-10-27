import { preview } from 'vite'
import { chromium } from 'playwright'
import { writeFile, mkdir } from 'node:fs/promises'
import { siteUrl, sitePages } from '../src/data/site.js'
const server = await preview({ preview: { port: 4188, strictPort: true } })
let browser
try {
 // Vercel Linux builds have no system Chrome; use the packaged serverless binary.
 if (process.platform === 'linux') {
  const { default: serverlessChromium } = await import('@sparticuz/chromium')
  browser = await chromium.launch({ args: serverlessChromium.args, executablePath: await serverlessChromium.executablePath(), headless: true })
 } else {
  browser = await chromium.launch({ channel: 'chrome' })
 }
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
 const errors = []; page.on('pageerror', error => errors.push(error.message))
 const documents = []
 for (const entry of [...sitePages, {path: '/404'}]) {
  await page.goto('http://127.0.0.1:4188' + entry.path)
  await page.waitForFunction(() => document.querySelector('main') && document.querySelector('link[rel="canonical"]'))
  await page.evaluate(() => document.fonts.ready)
  const html = await page.evaluate(() => {
   const clone = document.documentElement.cloneNode(true)
   // Exclude runtime geometry and locks from the static document.
   clone.removeAttribute('style'); clone.classList.remove('lenis', 'lenis-smooth')
   clone.querySelectorAll('[inert]').forEach(el => el.removeAttribute('inert'))
   clone.querySelectorAll('[data-entering], [data-preparing]').forEach(el => { el.removeAttribute('data-entering'); el.removeAttribute('data-preparing') })
   clone.querySelectorAll('main [style]').forEach(el => {
    for (const property of ['opacity','visibility','transform','filter','height','overflow','translate','scale']) el.style.removeProperty(property)
   })
   return '<!doctype html>\n' + clone.outerHTML
  })
  documents.push([entry.path,html])
 }
 if (errors.length) throw new Error(errors.join('\n'))
 // Write only after capturing every route: the preview must keep serving the empty app shell during generation.
 for (const [path, html] of documents) {
  const file = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : `dist${path}/index.html`
  await mkdir(file.slice(0,file.lastIndexOf('/')), {recursive:true}); await writeFile(file,html)
 }
 for (const [alias,path] of [['index.html','/'],['readwithlira.html','/projet/lira'],['services.html','/services']]) await writeFile('dist/'+alias,documents.find(([route])=>route===path)[1])
 await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + sitePages.map(page=>` <url><loc>${siteUrl}${page.path}</loc></url>`).join('\n') + '\n</urlset>\n')
 await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
 console.log(`Prerendered ${sitePages.length} pages, aliases, 404 and sitemap.`)
} finally { await browser?.close(); await new Promise(resolve=>server.httpServer.close(resolve)) }
