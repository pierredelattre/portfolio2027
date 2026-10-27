import { createRouter, createWebHistory, isNavigationFailure, NavigationFailureType } from 'vue-router'
import { nextTick } from 'vue'
import { stopInertia, restoreScroll, assistScroll } from './scroll'
import { motionPreference } from './motionPreference'
import { leavePage, revealPage, cleanupTransitions, resolvePageGeometry } from './animations/pageTransitions'
import { updateSeo } from './seo'
import { validateSharedProject } from './animations/sharedProjectTransition'
import Home from './pages/Home.vue'
import Lira from './pages/Lira.vue'
import PendingPage from './pages/PendingPage.vue'
import About from './pages/About.vue'
import Accessibility from './pages/Accessibility.vue'
import SiteMap from './pages/SiteMap.vue'
import Services from './pages/Services.vue'
import ProjectCaseStudy from './pages/ProjectCaseStudy.vue'
import { talkie, septiemeSeance, mbaFormations } from './data/caseStudies'
const router = createRouter({
 history: createWebHistory(),
 routes: [
  { path: '/', alias: '/index.html', component: Home, meta: { title: 'Pierre Delattre - Product Designer' } },
  { path: '/projet/lira', alias: '/readwithlira.html', component: Lira, meta: { title: 'Lira - Pierre Delattre', project: true } },
  { path: '/plan-du-site', component: SiteMap, meta: { title: 'Plan du site - Pierre Delattre' } },
  { path: '/accessibilite', component: Accessibility, meta: { title: 'Accessibilité - Pierre Delattre' } },
  { path: '/services', alias: '/services.html', component: Services, meta: { title: 'Services - Pierre Delattre' } },
  { path: '/a-propos', component: About, meta: { title: 'À propos - Pierre Delattre' } },
  { path: '/projet/talkie', component: ProjectCaseStudy, props: { project: talkie }, meta: { title: 'Talkie - Pierre Delattre', project: true } },
  { path: '/projet/septiemeseance', component: ProjectCaseStudy, props: { project: septiemeSeance }, meta: { title: 'Septième Séance - Pierre Delattre', project: true } },
  { path: '/projet/mba-formations', component: ProjectCaseStudy, props: { project: mbaFormations }, meta: { title: 'MBA Formations - Pierre Delattre', project: true } },
  { path: '/:pathMatch(.*)*', component: PendingPage, props: { title: 'Page introuvable', text: 'Retrouvez les projets depuis l’accueil.' } }
 ],
 async scrollBehavior(to, from, savedPosition) {
  if (from.matched.length && to.fullPath === from.fullPath && !savedPosition) return false
  await nextTick()
  // The outgoing animation ends in the navigation guard. Restore the
  // entering page before its own animation, preserving browser history.
  await new Promise(resolve => requestAnimationFrame(resolve))
  // A reload can carry a saved history position too. Only an in-app
  // history navigation should skip the entrance and restore that position.
  const historyPosition = from.matched.length > 0 ? savedPosition : null
  const restored = !!historyPosition || (from.matched.length > 0 && to.path === from.path)
  resolvePageGeometry({ restored })
  const target = to.hash ? document.getElementById(decodeURIComponent(to.hash.slice(1))) : null
  restoreScroll(historyPosition || { top: target ? target.getBoundingClientRect().top + window.scrollY : 0 })
  if (!savedPosition && from.matched.length && to.path !== from.path) document.querySelector('main')?.focus({ preventScroll: true })
  revealPage({ restored })
  return false
 }
})
router.beforeEach(async (to, from) => {
 validateSharedProject(to.path, from.path)
 stopInertia()
 if (from.matched.length && to.path !== from.path) await leavePage()
})
router.afterEach((to, from, failure) => {
 if (failure) {
  validateSharedProject(null, null)
  if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
   cleanupTransitions()
   resolvePageGeometry({ restored: true })
   revealPage({ restored: true })
   document.querySelector('main')?.focus({ preventScroll: true })
   if (to.path === '/' && !motionPreference.matches) assistScroll(0, .45)
   else restoreScroll({ top: 0 })
   return
  }
  // A click back to the current page can cancel a pending route. Keep that
  // page visible and resume scrolling instead of leaving it faded out.
  if (to.fullPath === router.currentRoute.value.fullPath) {
   cleanupTransitions()
   restoreScroll({ top: window.scrollY })
   revealPage({ restored: true })
  }
  return
 }
 // On a pushed route, reset while the outgoing page is still hidden,
 // before the header changes from overlay positioning back to normal flow.
 if (from.matched.length && to.path !== from.path && !window.history.state?.scroll) restoreScroll({ top: 0 })
 updateSeo(to)
})
export default router
