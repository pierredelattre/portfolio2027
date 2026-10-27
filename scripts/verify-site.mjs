import { chromium, webkit } from 'playwright'
import assert from 'node:assert/strict'
import { sitePages } from '../src/data/site.js'
const base=process.env.TEST_URL || 'http://127.0.0.1:4177'
for(const [name,engine] of [['Chrome',chromium],['WebKit',webkit]]) {
 const b=await engine.launch(name==='Chrome'?{channel:'chrome'}:{})
 try {
  const staticPage=await b.newPage({javaScriptEnabled:false,viewport:{width:1440,height:1000}})
  for(const entry of sitePages){
   await staticPage.goto(base+entry.path)
   assert.equal(await staticPage.locator('main').count(),1)
   assert.equal(await staticPage.title(),entry.title)
   assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'),'https://pierredelattre.fr'+entry.path)
   if(entry.path === '/plan-du-site') {
    const paths = await staticPage.locator('main nav a').evaluateAll(as=>as.map(a=>a.getAttribute('href')))
    for(const destination of sitePages) assert.ok(paths.includes(destination.path))
   } else assert.ok((await staticPage.locator('main').innerText()).length>150)
   assert.equal(await staticPage.locator('footer a[href="/llms.txt"]').count(),1)
   assert.equal(await staticPage.locator('[inert]').count(),0)
  }
  await staticPage.close()
  const page=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  for(const width of [390,768,1440]) {
   await page.setViewportSize({width,height:1000})
   for(const entry of sitePages){
    await page.goto(base+entry.path)
    await page.waitForFunction(()=>document.querySelector('main'))
    assert.equal(await page.locator('main').count(),1)
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name} overflow ${entry.path} ${width}`)
    for(const img of await page.locator('img').all()) if(await img.isVisible()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(i=>i.decode()) }
    assert.equal(await page.locator('video:not([poster])').count(),0)
   }
   await page.goto(base+'/')
   for(const preview of await page.locator('.project .preview:first-child').all()) {
    const fits=await preview.evaluate(el=>{const media=el.querySelector('video,img');const a=el.getBoundingClientRect(),b=media.getBoundingClientRect();return Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1&&['contain','cover'].includes(getComputedStyle(media).objectFit)})
    assert.ok(fits,`${name} cover ${width}`)
   }
  }
  await page.locator('header').getByRole('link',{name:'Services',exact:true}).click()
  await page.waitForURL('**/services');assert.equal(await page.title(),sitePages.find(p=>p.path==='/services').title)
  await page.goto(base+'/projet/lira')
  assert.equal(await page.locator('.metrics dd span[aria-hidden="true"]').allTextContents().then(v=>v.join(',')),'400,128,2,3')
  for(const path of ['/llms.txt','/sitemap.xml','/robots.txt']) assert.equal((await page.request.get(base+path)).status(),200)
  await page.goto(base+'/404.html');assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, follow')
  await page.goto(base+'/');assert.equal(await page.locator('.overlay').first().evaluate(el=>getComputedStyle(el).opacity),'0');for (const img of await page.locator('img').all()) if (await img.isVisible()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(i=>i.decode()) };await page.evaluate(()=>scrollTo(0,0));await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:`/tmp/portfolio-${name}-home.png`,fullPage:true})
  assert.deepEqual(errors,[])
  console.log(`${name}: ${sitePages.length} pages with and without JavaScript, SEO, mobile layouts, media decoding, cover framing, footer, metrics and resources passed.`)
 } finally {await b.close()}
}
