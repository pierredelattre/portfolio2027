import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Sample the encoded videos after their opening reveal, with UI visible.
const frames = { home: 6.2, intro: 3.6, quiz: 2, learn: 2, stats: 2,
 vocabulary: 2, translation: 2, onboarding: 2, library: 2, import: 2,
 review: 2, crossword: 2 }
for (const [name, seconds] of Object.entries(frames)) {
 const src = fileURLToPath(new URL(`../src/assets/lira/lira-${name}.mp4`, import.meta.url))
 const dest = fileURLToPath(new URL(`../src/assets/lira/lira-${name}-poster.jpg`, import.meta.url))
 const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-ss', String(seconds),
  '-i', src, '-frames:v', '1', '-vf', "scale='min(1600,iw)':-2", '-q:v', '2', '-y', dest], { stdio: 'inherit' })
 if (result.error) throw result.error
 if (result.status !== 0) throw new Error(`Poster generation failed: ${name}`)
 console.log(`Poster generated: ${name} (${seconds}s)`)
}
