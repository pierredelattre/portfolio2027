import { chromium, webkit } from 'playwright'
import assert from 'node:assert/strict'
const base = process.env.TEST_URL || 'http://127.0.0.1:4177'
for (const [name, engine] of [['Chrome',chromium],['WebKit',webkit]]) {
 const browser=await engine.launch(name==='Chrome'?{channel:'chrome'}:{})
 for (const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:900}})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.addInitScript(()=>{
  const original=HTMLMediaElement.prototype.play
  HTMLMediaElement.prototype.play=function(){
   if(!this.dataset.interrupted){this.dataset.interrupted='true';return Promise.reject(new DOMException('Simulated navigation interruption','AbortError'))}
   return original.call(this)
  }
 })
 async function ready(route){await page.waitForFunction(path=>(!path||location.pathname===path)&&(!path||!['/','/projet/lira'].includes(path)||document.querySelector(path==='/'?'main.home':'main.project-page'))&&document.querySelector('main')?.dataset.entering==='false',route)}
 async function advancing(selector){await page.waitForFunction(s=>{const v=document.querySelector(s);return v&&!v.paused&&v.currentTime>0.1},selector);const before=await page.locator(selector).first().evaluate(v=>v.currentTime);await page.waitForFunction(({s,t})=>{const v=document.querySelector(s);return v&&!v.paused&&v.currentTime>t+.15},{s:selector,t:before})}
 await page.goto(base + '/');await ready();await advancing('video')
 for(let i=0;i<1;i++){
 await page.locator('.project').first().locator('.button').click();await ready('/projet/lira');await advancing('.hero video')
 await page.locator('header').getByRole('link',{name:'Services',exact:true}).click();await ready('/services')
 await page.locator('header').getByRole('link',{name:'Réalisations',exact:true}).click();await ready('/');await advancing('video')
 }
 await page.locator('.project').first().locator('.preview').first().click();await ready('/projet/lira');await advancing('.hero video')
 await page.goBack();await ready('/');await advancing('video')
 await page.goForward();await ready('/projet/lira');await advancing('.hero video')
 const hero=page.locator('.hero video')
 await page.getByRole('button',{name:'Mettre la démonstration en pause',exact:true}).first().click()
 await page.waitForTimeout(300);assert.equal(await hero.evaluate(v=>v.paused),true)
 await page.getByRole('button',{name:'Lire la démonstration',exact:true}).first().click();await advancing('.hero video')
 const caseVideo=page.locator('.case-surface video').first()
 await caseVideo.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY));await advancing('.case-surface video');await page.waitForFunction(()=>document.querySelector('.hero video').paused)
 assert.equal(await hero.evaluate(v=>v.paused),true)
 await page.evaluate(()=>window.scrollTo(0,0));await advancing('.hero video')
 await page.waitForFunction(()=>document.querySelector('.case-surface video').paused)
 assert.ok(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.muted&&v.playsInline&&v.poster)))
 await page.locator('video').evaluateAll(async vs=>{await Promise.all(vs.map(v=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>img.naturalWidth?resolve():reject();img.onerror=reject;img.src=v.poster})))})
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);assert.equal(await hero.evaluate(v=>v.paused),true)
 await page.getByRole('button',{name:'Lire la démonstration',exact:true}).first().click();await advancing('.hero video')
 await page.emulateMedia({reducedMotion:'no-preference'});await advancing('.hero video')
 // Return from browser page restoration must resync even without scrolling.
 await page.evaluate(()=>{document.querySelector('.hero video').pause();window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))});await advancing('.hero video')
 assert.deepEqual(errors,[])
 console.log(`${name} ${width}px: navigation, history, interrupted play, scrolling, posters, manual pause, reduced motion and page restoration passed`)
 await page.close()
 }
 // A manual request must survive canplay on a cold, lazy-loaded video,
 // even when automatic motion is disabled.
 const reducedPage=await browser.newPage({reducedMotion:'reduce',viewport:{width:1440,height:900}})
 await reducedPage.goto(base+'/projet/lira')
 await reducedPage.waitForFunction(()=>document.querySelector('main')?.dataset.entering==='false')
 const coldVideo=reducedPage.locator('.case-surface video').first()
 await coldVideo.scrollIntoViewIfNeeded()
 assert.equal(await coldVideo.evaluate(v=>v.paused),true)
 await reducedPage.locator('.showcase__preview').filter({has:reducedPage.locator('video')}).first().getByRole('button').click()
 await reducedPage.waitForFunction(()=>{const v=document.querySelector('.case-surface video');return !v.paused&&v.currentTime>.3})
 await reducedPage.locator('.showcase__preview').filter({has:reducedPage.locator('video')}).first().getByRole('button',{name:'Mettre la démonstration en pause'}).click()
 assert.equal(await coldVideo.evaluate(v=>v.paused),true)
 await reducedPage.close()
 console.log(`${name}: cold manual playback with reduced motion passed`)
 await browser.close()
}
