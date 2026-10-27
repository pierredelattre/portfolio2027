import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
const manifest=JSON.parse(await readFile(new URL('../src/data/optimized-media.json',import.meta.url),'utf8'))
const keys=['lira/lira-intro-roomy.mp4',...['onboarding','quiz','learn','stats','vocabulary','translation','library','import','review','crossword'].map(n=>`lira/lira-${n}.mp4`),'mba/mba-intro-roomy.mp4','mba/mba-financement.mp4','mba/mba-keystatic.mp4','septiemeseance/septieme-intro-roomy.mp4']
for(const key of keys){
 for(const field of ['src','mobileSrc']){
  const file=resolve('public','.'+manifest[key][field])
  const result=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=avg_frame_rate,nb_frames:format=duration','-of','json',file],{encoding:'utf8'})
  assert.equal(result.status,0,result.stderr)
  const probe=JSON.parse(result.stdout),[n,d]=probe.streams[0].avg_frame_rate.split('/').map(Number)
  assert.equal(n/d,60,`${key} ${field} must be 60 fps`)
  if(key==='mba/mba-intro-roomy.mp4')assert.equal(Number(probe.format.duration),16.8)
  if(key.startsWith('septiemeseance/'))assert.equal(Number(probe.format.duration),11)
  const decoded=spawnSync('ffmpeg',['-v','error','-xerror','-i',file,'-f','null','-'],{encoding:'utf8'})
  assert.equal(decoded.status,0,`${key} ${field}: ${decoded.stderr}`)
 }
 console.log(`${key}: desktop/mobile 60 fps and full decoding passed`)
}
