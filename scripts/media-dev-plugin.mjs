import { spawn } from 'node:child_process'
import { resolve, sep } from 'node:path'
export function mediaDevPlugin() {
 return { name: 'responsive-media-source-watcher', configureServer(server) {
  const assetRoot = resolve(server.config.root,'src/assets') + sep
  let timer, running = false, pending = new Set(), closed = false
  const run = () => {
   if (running || closed || !pending.size) return
   const kinds = pending; pending = new Set(); running = true
   const args = [resolve(server.config.root,'scripts/optimize-media.mjs')]
   if(kinds.size===1) args.push(kinds.has('image')?'--images-only':'--videos-only')
   server.config.logger.info('Actualisation des médias adaptatifs…')
   const child=spawn(process.execPath,args,{cwd:server.config.root,stdio:'inherit'})
   let finished = false
   const finish = code => {
    if (finished) return
    finished = true
    running=false
    if (code) server.config.logger.error('La génération des médias a échoué. Relance npm run media.')
    else if(!closed) server.ws.send({type:'full-reload',path:'*'})
    run()
   }
   child.once('error',()=>finish(1));child.once('exit',finish)
  }
  const change = file => {
   if (!file.startsWith(assetRoot) || !/\.(jpg|mp4)$/i.test(file)) return
   pending.add(file.endsWith('.mp4')?'video':'image')
   clearTimeout(timer);timer=setTimeout(run,500)
  }
  server.watcher.add(assetRoot)
  server.watcher.on('change',change);server.watcher.on('add',change)
  server.httpServer?.once('close',()=>{closed=true;clearTimeout(timer);server.watcher.off('change',change);server.watcher.off('add',change)})
 } }
}
