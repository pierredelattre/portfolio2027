import { siteUrl, sitePages } from './data/site'
function meta(name, content, property = false) {
 const key = property ? 'property' : 'name'
 let element = document.head.querySelector(`meta[${key}="${name}"]`)
 if (!element) { element = document.createElement('meta'); element.setAttribute(key, name); document.head.append(element) }
 element.content = content
}
export function updateSeo(route) {
 const canonicalPath = route.matched[0]?.path || route.path
 const page = sitePages.find(page => page.path === canonicalPath)
 document.title = page?.title || 'Page introuvable - Pierre Delattre'
 meta('description', page?.description || 'Retrouvez les projets et services de Pierre Delattre depuis l’accueil.')
 meta('robots', page ? 'index, follow' : 'noindex, follow')
 let canonical = document.head.querySelector('link[rel="canonical"]')
 if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
 canonical.href = siteUrl + (page?.path || route.path)
 meta('og:title', document.title, true)
 meta('og:description', page?.description || '', true)
 meta('og:url', canonical.href, true)
 meta('og:type', 'website', true)
 meta('og:locale', 'fr_FR', true)
 let schema = document.querySelector('#site-schema')
 if (!schema) { schema = document.createElement('script'); schema.id = 'site-schema'; schema.type = 'application/ld+json'; document.head.append(schema) }
 schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
  { '@type': 'Person', '@id': siteUrl + '/#pierre', name: 'Pierre Delattre', jobTitle: 'Product Designer', url: siteUrl, email: 'hello@pierredelattre.fr', knowsAbout: ['Product Design', 'Design Engineering', 'Accessibilité web'] },
  { '@type': 'WebSite', '@id': siteUrl + '/#website', name: 'Portfolio 2027 de Pierre Delattre', url: siteUrl, inLanguage: 'fr', author: { '@id': siteUrl + '/#pierre' } },
  { '@type': route.meta.project ? 'CreativeWork' : 'WebPage', name: document.title, description: page?.description, url: canonical.href, inLanguage: 'fr', author: { '@id': siteUrl + '/#pierre' } }
 ] })
}
