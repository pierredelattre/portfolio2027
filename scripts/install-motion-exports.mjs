import {copyFile,readFile} from 'node:fs/promises'
import {spawnSync} from 'node:child_process'
import {resolve} from 'node:path'
const temporary=process.argv[2] || '/private/tmp/motion-60'
const jobs=[...['onboarding','quiz','learn','vocabulary','translation','library','import','review','crossword'].map(n=>[`lira-${n}`,`lira/lira-${n}`]),['lira-statistics','lira/lira-stats'],['lira-intro-roomy','lira/lira-intro-roomy'],['mba-intro-roomy','mba/mba-intro-roomy'],['mba-financement','mba/mba-financement'],['mba-keystatic','mba/mba-keystatic']]
for(const [scene,key] of jobs){
 const report=JSON.parse(await readFile(resolve(temporary,scene+'.json'),'utf8'))
 if(report.fps!==60)throw Error(scene+' must be rendered at 60 fps')
 await copyFile(resolve(temporary,scene+'.mp4'),resolve('src/assets',key+'.mp4'))
}
await copyFile(resolve('motion-scenes/septieme-validation/septieme-11s-60fps.mp4'),resolve('src/assets/septiemeseance/septieme-intro-roomy.mp4'))
const posters=[...jobs.map(([scene,key])=>[key,key.endsWith('-intro-roomy')?0:2]),['septiemeseance/septieme-intro-roomy',0]]
for(const [key,time] of posters){const result=spawnSync('ffmpeg',['-y','-v','error','-ss',String(time),'-i',resolve('src/assets',key+'.mp4'),'-frames:v','1','-q:v','2',resolve('src/assets',key+'-poster.jpg')],{stdio:'inherit'});if(result.status)throw Error('Poster failed: '+key)}
for(const [key,time] of [['lira/lira-intro-roomy',24800],['mba/mba-intro-roomy',14000],['septiemeseance/septieme-intro-roomy',8500]]){const result=spawnSync('ffmpeg',['-y','-v','error','-ss',String(time/1000),'-i',resolve('src/assets',key+'.mp4'),'-frames:v','1','-q:v','2',resolve('src/assets',key+'-still.jpg')],{stdio:'inherit'});if(result.status)throw Error('Still failed: '+key)}
console.log('Installed 15 motion exports with matching posters and reduced-motion stills.')
