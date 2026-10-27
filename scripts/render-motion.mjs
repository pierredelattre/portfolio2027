import { chromium } from 'playwright'
import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
const scene = process.argv[2], output = resolve(process.argv[3] || `/tmp/${scene}-60fps.mp4`)
if (!scene || !/^[a-z0-9-]+$/.test(scene)) throw Error('Usage: node scripts/render-motion.mjs <scene-name> <output.mp4>')
await mkdir(dirname(output), {recursive:true})
const temporary = output.replace(/\.mp4$/, '.tmp.mp4')
const roomy = scene.endsWith('-roomy')
const size = roomy ? {width:1540,height:1260} : {width:1600,height:1000}
const browser = await chromium.launch({channel:'chrome'})
let encoder
try {
 const page = await browser.newPage({viewport:size,deviceScaleFactor:1,reducedMotion:'no-preference'})
 const errors = []; page.on('pageerror', e => errors.push(e.message))
 await page.goto(pathToFileURL(resolve('motion-scenes',scene,'index.html')).href+'?capture=1&render=1')
 await page.evaluate(async () => {
  await Promise.all([document.fonts.ready,...[...document.images].map(img=>img.decode())])
  if(window.motion?.readyPromise)await window.motion.readyPromise
  if (!window.motion) window.motion={duration:DURATION,seek:t=>{pause();time=t;render(t)}}
  if(typeof cancelCountdown==='function')cancelCountdown()
  window.motion.pause?.()
  const loop=document.getElementById('loop')
  if(loop){loop.checked=true;loop.dispatchEvent(new Event('change'))}
  document.querySelectorAll('.countdown').forEach(el=>el.remove())
  window.motion.seek(0)
 })
 const duration = await page.evaluate(() => window.motion.duration), fps=60, frames=Math.round(duration*fps/1000)
 encoder=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate',String(fps),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',temporary])
 encoder.stderr.on('data', d => process.stderr.write(d))
 const ended=once(encoder,'exit')
 for(let i=0;i<frames;i++) {
  await page.evaluate(t => window.motion.seek(t), i*1000/fps)
  const png=await page.screenshot({type:'png'})
  if(!encoder.stdin.write(png)) await once(encoder.stdin,'drain')
  if(i%120===0) console.log(`${scene}: ${i}/${frames} frames`)
 }
 encoder.stdin.end();const [code]=await ended;if(code)throw Error('Encoder failed: '+code)
 if(errors.length)throw Error(errors.join('\n'))
 const decoded=spawnSync('ffmpeg',['-v','error','-xerror','-i',temporary,'-f','null','-'],{encoding:'utf8'})
 if(decoded.status!==0)throw Error(decoded.stderr)
 await rename(temporary,output)
 const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate,nb_frames:format=duration','-of','json',output],{encoding:'utf8'})
 if(probe.status!==0)throw Error(probe.stderr)
 const report={scene,fps,frames,durationMs:duration,...size,probe:JSON.parse(probe.stdout)}
 await writeFile(output.replace(/\.mp4$/, '.json'),JSON.stringify(report,null,2)+'\n')
 console.log(JSON.stringify({output,...report}))
} finally {if(encoder?.exitCode===null)encoder.kill();await browser.close()}
