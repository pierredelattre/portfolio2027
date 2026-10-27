import sharp from 'sharp'
import { readdir, readFile, writeFile, mkdir, stat, rename } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { resolve, relative } from 'node:path'
const root = resolve(new URL('..', import.meta.url).pathname), input = resolve(root, 'src/assets'), output = resolve(root, 'public/media')
await mkdir(output, { recursive: true })
const manifestPath = resolve(root, 'src/data/optimized-media.json')
let manifest = {}
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')) } catch {}
const report = { images: [], videos: [] }
const checkOnly = process.argv.includes('--check')
let checked = 0
function stale(key) { throw new Error(`Optimized media missing or stale: ${key}. Run npm run media locally and commit public/media and src/data/optimized-media.json.`) }
async function files(dir) { const entries = await readdir(dir, { withFileTypes: true }); return (await Promise.all(entries.map(e => e.isDirectory() ? files(resolve(dir,e.name)) : resolve(dir,e.name)))).flat() }
for (const file of await files(input)) {
 const key = relative(input, file), jpg = key.endsWith('.jpg'), video = key.endsWith('.mp4') && !key.includes('demo') && !key.includes('-mobile')
 if (!jpg && !video) continue
 if (process.argv.includes('--images-only') && !jpg || process.argv.includes('--videos-only') && !video) continue
 // Preserve fine text in the updated persona without another lossy encoding pass.
 const lossless = key === 'lira/persona-01.jpg'
 const original = await readFile(file), hash = createHash('sha256').update(original).update(lossless ? 'webp-lossless-v1' : key === 'mba/mba-intro-roomy.mp4' ? 'h264-repair-v2' : '').digest('hex').slice(0,12), stem = key.replace(/\.(jpg|mp4)$/,'').replaceAll('/','-') + '-' + hash
 if (jpg) {
  const meta = await sharp(original).metadata(), widths = [...new Set([480,768,1024,1440,1920, ...(key === 'lira/flow.jpg' ? [2560, meta.width] : [])].map(w=>Math.min(w,meta.width)))].sort((a,b)=>a-b)
  const variants = []
  for (const width of widths) {
   const name = stem + '-' + width + '.webp', dest = resolve(output,name)
   try { await stat(dest) } catch { if (checkOnly) stale(key); await sharp(original).rotate().resize({width,withoutEnlargement:true}).webp(lossless ? {lossless:true,effort:6} : {quality:88,effort:4}).toFile(dest) }
   variants.push({width,src:'/media/'+name,bytes:(await stat(dest)).size})
  }
  const entry = {src:variants.at(-1).src,srcset:variants.map(v=>v.src+' '+v.width+'w').join(', '),width:meta.width,height:meta.height}
  if (checkOnly && JSON.stringify(manifest[key]) !== JSON.stringify(entry)) stale(key)
  manifest[key] = entry
  report.images.push({key,original:original.length,largest:variants.at(-1).bytes,variants})
 } else {
  const variants = []
  for (const [kind,maxWidth] of [['desktop',1600],['mobile',960]]) {
   const source = kind==='mobile' && key==='septiemeseance/septieme-intro.mp4' ? resolve(input,'septiemeseance/septieme-intro-mobile.mp4') : file
   const mobileHash = source===file?hash:createHash('sha256').update(await readFile(source)).digest('hex').slice(0,12)
   const name = stem + '-' + kind + '-' + mobileHash + '.mp4', dest=resolve(output,name)
   try { await stat(dest) } catch {
    if (checkOnly) stale(key)
    const temporary = dest.replace(/\.mp4$/, `.${process.pid}.tmp.mp4`)
    const result=spawnSync('ffmpeg',['-y','-loglevel','error','-i',source,'-vf',`scale=w='min(${maxWidth},iw)':h=-2,fps=60`,'-an','-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',temporary],{stdio:'inherit'})
    if(result.error || result.status!==0)throw Error('Video optimization failed: '+key+' (ffmpeg: '+(result.error?.message || result.status)+')')
    const decoded = spawnSync('ffmpeg', ['-v', 'error', '-xerror', '-i', temporary, '-f', 'null', '-'], {encoding:'utf8'})
    if (decoded.error || decoded.status !== 0) throw Error('Video decoding failed: ' + key + ': ' + (decoded.error?.message || decoded.stderr))
    await rename(temporary, dest)
   }
   if (checkOnly) {
    const entry = manifest[key], mobile = kind === 'mobile'
    if (entry?.[mobile ? 'mobileSrc' : 'src'] !== '/media/' + name || !(entry?.[mobile ? 'mobileWidth' : 'width'] > 0) || !(entry?.[mobile ? 'mobileHeight' : 'height'] > 0)) stale(key)
    continue
   }
   const result = spawnSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',dest],{encoding:'utf8'})
   if (result.error || result.status !== 0) throw new Error(`ffprobe failed for ${key}: ${result.error?.message || result.stderr}. Install ffmpeg locally to run npm run media.`)
   const probe = JSON.parse(result.stdout), stream = probe.streams.find(s=>s.codec_type==='video')
   variants.push({kind,src:'/media/'+name,width:stream.width,height:stream.height,bytes:(await stat(dest)).size,duration:Number(probe.format.duration),audio:probe.streams.some(s=>s.codec_type==='audio')})
  }
  if (checkOnly) { checked++; continue }
  manifest[key]={src:variants[0].src,width:variants[0].width,height:variants[0].height,mobileSrc:variants[1].src,mobileWidth:variants[1].width,mobileHeight:variants[1].height}
  report.videos.push({key,original:original.length,variants})
 }
 checked++
}
if (checkOnly) { console.log(`Verified ${checked} optimized media sets without ffmpeg/ffprobe.`); process.exit(0) }
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n')
const reportFile = process.argv.includes('--images-only')?'media-images.json':process.argv.includes('--videos-only')?'media-videos.json':'media-report.json'
await mkdir(resolve(root,'verification'),{recursive:true});await writeFile(resolve(root,'verification',reportFile),JSON.stringify(report,null,2)+'\n')
console.log(`Generated ${report.images.length} image sets and ${report.videos.length} video sets.`)
console.log(JSON.stringify({imageOriginal:report.images.reduce((s,i)=>s+i.original,0),imageLargest:report.images.reduce((s,i)=>s+i.largest,0),videoOriginal:report.videos.reduce((s,i)=>s+i.original,0),videoDesktop:report.videos.reduce((s,i)=>s+i.variants[0].bytes,0)}))
