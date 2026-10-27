import gsap from 'gsap'
import { motionPreference } from '../motionPreference'

let transfer
const desktop = () => window.matchMedia('(min-width: 1024px)').matches

// Measure the painted content, including the cover crop inside a preview.
function contentBox(element, rect) {
 if (element.tagName === 'IFRAME') return { width: rect.width, height: rect.height, x: 0, y: 0 }
 const width = element.videoWidth || element.naturalWidth || Number(element.getAttribute('width')) || rect.width
 const height = element.videoHeight || element.naturalHeight || Number(element.getAttribute('height')) || rect.height
 const fit = getComputedStyle(element).objectFit
 const scale = fit === 'cover' ? Math.max(rect.width / width, rect.height / height) : Math.min(rect.width / width, rect.height / height)
 return { width: width * scale, height: height * scale, x: (rect.width - width * scale) / 2, y: (rect.height - height * scale) / 2 }
}

// HTML motions use a frozen copy of the rendered frame, isolated from site CSS.
function motionSnapshot(source, content) {
 const doc = source.contentDocument
 if (!doc || doc.body.dataset.ready !== 'true') return null
 const host = document.createElement('div')
 const shadow = host.attachShadow({ mode: 'open' })
 const body = doc.body.cloneNode(true)
 const originals = [doc.body, ...doc.body.querySelectorAll('*')]
 const copies = [body, ...body.querySelectorAll('*')]
 originals.forEach((element, index) => {
  const style = source.contentWindow.getComputedStyle(element)
  copies[index].style.cssText = [...style].map(key => `${key}:${style.getPropertyValue(key)}`).join(';')
  if (element.tagName === 'IMG') copies[index].src = element.currentSrc
 })
 body.querySelectorAll('script, .controls, .countdown').forEach(element => element.remove())
 const fonts = document.createElement('style')
 fonts.textContent = [...doc.querySelectorAll('style')].map(style => style.textContent.match(/@font-face\s*\{[^}]+\}/g)?.join('\n') || '').join('\n').replace(/url\(([^)]+)\)/g, (_, url) => `url("${new URL(url.replace(/["']/g, ''), doc.baseURI).href}")`)
 const canvas = document.createElement('div')
 canvas.style.cssText = `width:${source.clientWidth}px;height:${source.clientHeight}px;transform-origin:0 0;transform:scale(${content.width / source.clientWidth});pointer-events:none`
 canvas.append(body)
 shadow.append(fonts, canvas)
 return host
}

export function cancelSharedProject() {
 const state = transfer
 if (!state) return
 transfer = undefined
 state.timeline?.kill()
 state.fade?.kill()
 clearTimeout(state.timeout)
 window.removeEventListener('resize', cancelSharedProject)
 state.target?.style.removeProperty('visibility')
 if (state.targetVideo) {
  delete state.targetVideo.dataset.sharedTransition
  state.targetVideo.dispatchEvent(new Event('canplay'))
 }
 if (state.originalParent.isConnected && state.isVideo) {
  state.originalParent.prepend(state.media)
  if (state.originalStyle === null) state.media.removeAttribute('style')
  else state.media.setAttribute('style', state.originalStyle)
  delete state.media.dataset.sharedTransition
 } else if (state.isVideo) state.media.pause()
 state.layer.remove()
}

export function captureProjectPreview(event, route) {
 if (event.defaultPrevented || event.button !== 0 || event.detail === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !desktop() || motionPreference.matches) return
 const link = event.target.closest('a')
 if (!link || new URL(link.href).pathname !== route || link.target === '_blank') return
 cancelSharedProject()
 const preview = event.currentTarget.querySelector('.preview')
 const source = preview?.querySelector('video, img, iframe')
 if (!source) return
 const rect = preview.getBoundingClientRect()
 if (!rect.width || rect.bottom <= 0 || rect.top >= innerHeight) return
 const sourceRect = source.getBoundingClientRect()
 const content = contentBox(source, sourceRect)
 content.x += sourceRect.left - rect.left
 content.y += sourceRect.top - rect.top
 const isVideo = source.tagName === 'VIDEO'
 const isMotion = source.tagName === 'IFRAME'
 // Keep the actual video playing while Vue replaces the page.
 const media = isVideo ? source : isMotion ? motionSnapshot(source, content) : source.cloneNode(false)
 if (!media) return
 const motionTime = isMotion ? Number(source.contentDocument.body.dataset.time) : undefined
 const originalParent = source.parentElement
 const originalStyle = source.getAttribute('style')
 const layer = document.createElement('div')
 layer.dataset.sharedProject = route
 layer.setAttribute('aria-hidden', 'true')
 layer.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;overflow:hidden;pointer-events:none;z-index:30;contain:layout paint;border-radius:${getComputedStyle(preview).borderRadius};background:${getComputedStyle(preview).backgroundColor}`
 if (isVideo) media.dataset.sharedTransition = 'true'
 else if (!isMotion) { media.removeAttribute('srcset'); media.src = source.currentSrc; media.removeAttribute('loading') }
 media.removeAttribute('aria-describedby')
 media.style.cssText = `position:absolute;left:0;top:0;width:${content.width}px;height:${content.height}px;max-width:none;max-height:none;object-fit:fill;border-radius:0;transform:none;transform-origin:0 0;pointer-events:none`
 // contentBox already includes the CSS zoom in the painted dimensions.
 // Reset the inherited transform so GSAP cannot apply that zoom twice.
 gsap.set(media, { x: content.x, y: content.y, scaleX: 1, scaleY: 1 })
 layer.append(media)
 document.body.append(layer)
 transfer = { route, layer, media, isVideo, isMotion, motionTime, content, originalParent, originalStyle, sourceTag: source.tagName, sourceUrl: source.currentSrc || source.src }
 // A failed or interrupted route must never leave a floating preview behind.
 transfer.timeout = setTimeout(cancelSharedProject, 2500)
 window.addEventListener('resize', cancelSharedProject)
}

export function validateSharedProject(to, from) {
 if (transfer && (transfer.route !== to || (from !== '/' && from !== '/index.html') || !desktop() || motionPreference.matches)) cancelSharedProject()
}

function readyFrame(video, state, time = state.media.currentTime) {
 return new Promise(resolve => {
  let frame, timer
  const finish = () => {
   clearTimeout(timer)
   video.removeEventListener('seeked', seeked)
   if (frame !== undefined) video.cancelVideoFrameCallback?.(frame)
   resolve()
  }
  const seeked = () => {
   if (video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(finish)
   else requestAnimationFrame(() => requestAnimationFrame(finish))
  }
  timer = setTimeout(finish, 350)
  video.addEventListener('seeked', seeked, { once: true })
  try { video.currentTime = time; video.muted = true; video.play().catch(() => {}) } catch { finish() }
 })
}

export function revealSharedProject(main) {
 const state = transfer
 if (!state || !desktop() || motionPreference.matches) { cancelSharedProject(); return false }
 const target = main.querySelector('.hero__showcase video, .hero__showcase img, .hero__showcase iframe')
 if (!target) { cancelSharedProject(); return false }
 const sameMedia = target.tagName === state.sourceTag && new URL(target.currentSrc || target.src, location.href).pathname === new URL(state.sourceUrl, location.href).pathname
 const frame = target.closest('.video-wrap, .motion-wrap') || target
 const rect = frame.getBoundingClientRect()
 if (!rect.width || !rect.height) { cancelSharedProject(); return false }
 const targetRect = target.getBoundingClientRect()
 // Different home/hero compositions keep the home frame's proportions
 // while expanding, then dissolve into the hero's own intro.
 const scale = Math.min(rect.width / state.content.width, rect.height / state.content.height)
 const painted = sameMedia ? contentBox(target, targetRect) : { width: state.content.width * scale, height: state.content.height * scale, x: (rect.width - state.content.width * scale) / 2, y: (rect.height - state.content.height * scale) / 2 }
 painted.x += targetRect.left - rect.left
 painted.y += targetRect.top - rect.top
 state.target = frame
 if (target.tagName === 'VIDEO') {
  // Keep the hero player from pausing an in-flight seek before its frame
  // is decoded. Its normal visibility playback resumes after handoff.
  state.targetVideo = target
  target.dataset.sharedTransition = 'true'
 }
 frame.style.visibility = 'hidden'
 const finish = async () => {
  if (target.tagName === 'IFRAME') {
   const started = performance.now()
   while (transfer === state && frame.dataset.ready !== 'true' && performance.now() - started < 500) await new Promise(resolve => setTimeout(resolve, 30))
   if (transfer !== state) return
   target.contentWindow.motion?.seek(sameMedia ? state.motionTime : 0)
   target.contentWindow.motion?.play()
  }
  if (target.tagName === 'VIDEO') {
   if (target.readyState < 1) {
    await new Promise(resolve => {
     const done = () => { clearTimeout(timer); target.removeEventListener('loadedmetadata', done); resolve() }
     const timer = setTimeout(done, 300)
     target.addEventListener('loadedmetadata', done, { once: true })
     target.load()
    })
   }
   if (transfer !== state) return
   await readyFrame(target, state, sameMedia ? state.media.currentTime : 0)
  }
  if (transfer !== state) return
  if (sameMedia) cancelSharedProject()
  else {
   frame.style.removeProperty('visibility')
   state.fade = gsap.to(state.layer, { opacity: 0, duration: .22, ease: 'power2.out', onComplete: () => { if (transfer === state) cancelSharedProject() } })
  }
 }
 // Images inherit their visible corner clipping from the hero container.
 const frameRadius = getComputedStyle(frame).borderRadius
 const radius = parseFloat(frameRadius) > 0 ? frameRadius : getComputedStyle(target.closest('.hero__showcase')).borderRadius
 state.timeline = gsap.timeline({ onComplete: finish })
 state.timeline.to(state.layer, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: radius, backgroundColor: getComputedStyle(frame).backgroundColor, duration: .72, ease: 'power3.inOut' }, 0)
 state.timeline.to(state.media, { x: painted.x, y: painted.y, scaleX: painted.width / state.content.width, scaleY: painted.height / state.content.height, duration: .72, ease: 'power3.inOut' }, 0)
 return true
}
