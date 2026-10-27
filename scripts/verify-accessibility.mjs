import { chromium, webkit } from 'playwright'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { sitePages } from '../src/data/site.js'
const base = process.env.TEST_URL || 'http://127.0.0.1:4177'
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const results = [], manual = []
if(process.argv.includes('--manual-only')) results.push(...JSON.parse(await readFile('verification/accessibility-results.json','utf8')).results)
await mkdir('verification', {recursive:true})
for (const [name,engine] of [['Chrome',chromium],['WebKit',webkit]]) {
 const b=await engine.launch(name==='Chrome'?{channel:'chrome'}:{})
 try {
  const page=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  if(!process.argv.includes('--manual-only')) {
  for(const entry of sitePages) {
   for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});await page.goto(base+entry.path)
    await page.waitForFunction(()=>document.querySelector('main')?.dataset.entering==='false')
    for(const img of await page.locator('img').all())if(await img.isVisible()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode())}
    await page.addScriptTag({content:axe})
    const r=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}))
    results.push({browser:name,path:entry.path,width,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length})
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,entry.path+' reflow')
    assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('main').count(),1)
    assert.equal(await page.locator('html').getAttribute('lang'),'fr')
    assert.ok(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.paused)))
    // Explicit text-spacing overrides rather than screenshots alone.
    const style=await page.addStyleTag({content:'p,li,dt,dd,h1,h2,a{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'})
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,entry.path+' spacing')
    await style.evaluate(e=>e.remove())
   }
   await writeFile('verification/accessibility-results.json',JSON.stringify({results,manual},null,2)+'\n')
   console.log(name+' '+entry.path+': axe desktop/mobile, '+results.slice(-2).reduce((s,r)=>s+r.violations.length,0)+' rule violations; reflow and text spacing checked')
  }
  }
  await page.setViewportSize({width:320,height:1000})
  for(const entry of sitePages){await page.goto(base+entry.path);await page.waitForFunction(()=>document.querySelector('main')?.dataset.entering==='false');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
  // Equivalent 400% viewport reflow and native focus traversal.
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/');await page.waitForFunction(()=>document.querySelector('main')?.dataset.entering==='false')
  await page.keyboard.press(name==='WebKit'?'Alt+Tab':'Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Aller au contenu');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'contenu')
  await page.locator('footer a[href="/llms.txt"]').focus();assert.ok(await page.evaluate(()=>document.activeElement.getBoundingClientRect().bottom<=innerHeight+1))
  await page.locator('footer a[href="/llms.txt"]').press(name==='WebKit'?'Alt+Shift+Tab':'Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Réduire les animations')
  await page.locator('footer button').press(name==='WebKit'?'Alt+Shift+Tab':'Shift+Tab');assert.ok((await page.evaluate(()=>document.activeElement.textContent)).includes('Accessibilité'))
  // Manual preference stops every visible motion, persists and respects system preference.
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+'/');await page.waitForFunction(()=>document.querySelector('main')?.dataset.entering==='false')
  await page.locator('footer button').click();assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('motion-reduced')))
  assert.ok(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.paused)));assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('lenis')),false)
  await page.reload();await page.waitForFunction(()=>document.querySelector('main')?.dataset.entering==='false');assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('motion-reduced')))
  await page.locator('footer button').click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.classList.contains('motion-reduced'))
  const llms=await page.request.get(base+'/llms.txt');assert.ok(llms.headers()['content-type'].includes('charset=utf-8'));assert.ok((await llms.text()).includes('basé à Lille'));assert.ok(!(await llms.text()).includes('Ã'))
  const staticPage=await b.newPage({javaScriptEnabled:false});for(const entry of sitePages){await staticPage.goto(base+entry.path);assert.equal(await staticPage.locator('main').count(),1);assert.ok((await staticPage.locator('main').innerText()).length>150)}await staticPage.close()
  assert.deepEqual(errors,[])
  manual.push({browser:name,checks:['320px reflow (400% equivalent)','keyboard skip and reverse footer traversal','visible focus','live reduced-motion','manual motion pause and persisted preference','UTF-8 llms','all pages without JavaScript','text spacing','single h1/main/lang']})
 } finally {await b.close()}
}
await writeFile('verification/accessibility-results.json',JSON.stringify({date:'2026-10-14',axeVersion:JSON.parse(await readFile(new URL('../node_modules/axe-core/package.json',import.meta.url),'utf8')).version,results,manual},null,2)+'\n')
const failures=results.filter(r=>r.violations.length)
console.log('Accessibility: '+results.length+' page/viewport/browser scans; '+failures.length+' scans with violations.')
if(failures.length){for(const f of failures)console.log(f.browser,f.path,f.width,f.violations.map(v=>v.id));process.exitCode=1}
