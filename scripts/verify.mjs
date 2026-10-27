import { spawn } from 'node:child_process'
import { once } from 'node:events'
// Run the maintained checks against a served build (TEST_URL can override it).
for (const script of ['verify-site.mjs','verify-media-fit.mjs','verify-videos.mjs','verify-accessibility.mjs']) {
 const child = spawn(process.execPath,[new URL(script,import.meta.url).pathname],{stdio:'inherit',env:process.env})
 const [code] = await once(child,'exit')
 if (code !== 0) { process.exitCode = code || 1; break }
}
