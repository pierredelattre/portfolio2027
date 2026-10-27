import { chromium, webkit } from 'playwright'
import assert from 'node:assert/strict'
const base = process.env.TEST_URL || 'http://127.0.0.1:4177'
const widths = [375, 390, 600, 768, 820, 1023, 1024, 1280, 1440, 1920]
const routes = ['/', '/projet/lira', '/projet/mba-formations', '/projet/septiemeseance', '/projet/talkie']
for (const [name, engine] of [['Chrome', chromium], ['WebKit', webkit]]) {
 const browser = await engine.launch(name === 'Chrome' ? { channel: 'chrome' } : {})
 try {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  const errors = []; page.on('pageerror', error => errors.push(error.message))
  for (const route of routes) {
   await page.goto(base + route)
   await page.waitForFunction(() => document.querySelector('main')?.dataset.entering === 'false')
   for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 })
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    for (const img of await page.locator('img').all()) if (await img.isVisible()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(img => img.decode()) }
    const violations = await page.evaluate(() => {
     const issues = []
     if (document.documentElement.scrollWidth > innerWidth) issues.push('page overflow')
     for (const media of document.querySelectorAll('.preview img, .preview video, .showcase__media img, .showcase__media video, .hero__showcase img, .hero__showcase video')) {
      const a = media.getBoundingClientRect()
      if (!a.width || !a.height) continue
      const frame = media.closest('.preview, .showcase__media, .hero__showcase')
      const b = frame.getBoundingClientRect()
      if (a.left < b.left - 1 || a.right > b.right + 1 || a.top < b.top - 1 || a.bottom > b.bottom + 1) issues.push(`${media.getAttribute('alt') || media.getAttribute('aria-label')}: media outside frame`)
      if (!['contain', 'cover'].includes(getComputedStyle(media).objectFit)) issues.push('unexpected media fit')
      if (media.tagName === 'IMG' && (!media.complete || !media.naturalWidth)) issues.push('image failed to load')
     }
     return issues
    })
    assert.deepEqual(violations, [], `${name} ${route} ${width}px`)
    if (route === '/' && [390, 820, 1440].includes(width)) {
     await page.evaluate(() => scrollTo(0, 0))
     await page.mouse.move(0, 0)
     await page.screenshot({path: `/tmp/portfolio-fit-${name}-${width}.png`, fullPage: true})
    }
   }
  }
  assert.deepEqual(errors, [])
  console.log(`${name}: home and four projects, ${widths.join(', ')}px, live resize, image decoding and media bounds passed.`)
 } finally { await browser.close() }
}
