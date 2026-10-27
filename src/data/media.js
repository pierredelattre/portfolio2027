import assets from './optimized-media.json'
import { mediaDescriptions, mediaAlternatives } from './mediaDescriptions'
function asset(path) { const item = assets[path]; if (!item) throw new Error(`Asset introuvable : ${path}`); return item }
export function image(path, alt, mobile) {
 const desktop = asset(path), small = mobile ? asset(mobile) : undefined
 return { ...desktop, alt: alt ? mediaAlternatives[path] || alt : '', sourceKey: path, description: mediaDescriptions[path], mobile: small?.src, mobileSrcset: small?.srcset, mobileWidth: small?.width, mobileHeight: small?.height }
}
function posterAt(path, limit) { const item=asset(path); return item.srcset?.split(', ').map(value=>{ const [src,width]=value.split(' ');return {src,width:Number(width.slice(0,-1))} }).find(v=>v.width>=limit)?.src || item.src }
export function video(path, poster, alt) {
 const mobilePoster = path === 'septiemeseance/septieme-intro.mp4' ? posterAt('septiemeseance/septieme-intro-mobile-poster.jpg',768) : posterAt(poster,768)
 const mobileReducedMotionPoster = path === 'septiemeseance/septieme-intro.mp4' ? posterAt('septiemeseance/septieme-intro-mobile-still.jpg',768) : undefined
 return { type: 'video', sourceKey: path, description: mediaDescriptions[path], ...asset(path), poster: posterAt(poster,1024), mobilePoster, mobileReducedMotionPoster, alt }
}
