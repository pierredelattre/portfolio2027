import { image, video } from './media'
import { mediaDescriptions } from './mediaDescriptions'
const intro = {
 ...video('lira/lira-intro-roomy.mp4', 'lira/lira-intro-roomy-poster.jpg', 'Lira : lectures guidées, traduction et sauvegarde en contexte, puis révision', 1600, 1000),
 introMotion: true,
 description: mediaDescriptions['lira/lira-intro.mp4'],
 reducedMotionPoster: image('lira/lira-intro-roomy-still.jpg', '').src
}
const homePreview = { ...intro, fill: true, zoom: 1.35, safeFrameWidth: 1240 / 2200 }
export const lira = {
 title: 'Lira', name: 'readwithlira.com', domain: 'Apprentissage', year: '2026', route: '/projet/lira', layout: 'three',
 objective: 'Aider les apprenants à lire dans une langue étrangère et à retenir le vocabulaire utile.',
 services: ['Product Design', 'Design Engineering'], tools: ['Figma', 'Claude Code', 'GitHub', 'Vercel', 'Docker', 'PostHog'],
 status: 'En ligne depuis mars 2026, Suivi des usages et retours utilisateurs depuis août 2026.', url: 'https://readwithlira.com/fr',
 hero: { ...intro, frameRatio: '16 / 10', fit: 'cover', zoom: 1.3 },
 theme: { hero: '#c0d4bd', footer: '#1d3428' },
 previews: [
 { key: 'demo', label: 'Découvrir Lira', media: homePreview },
 { key: 'onboarding', label: 'Premières étapes', mobile: false, media: { ...video('lira/lira-onboarding.mp4', 'lira/lira-onboarding-poster.jpg', 'Découverte de Lira : langue, niveau et lecture d’essai', 3200, 2000), motionPreview: true } },
 { key: 'dark-mode', imageScale: 2.5, mobileImageScale: 2, label: 'Lecture en mode sombre', background: '#1D1B19', media: image('lira/dark-mode-2027.jpg', 'Interface de lecture Lira en mode sombre') }
 ]
}
const motion = (name, alt) => ({
 ...video(`lira/lira-${name}.mp4`, `lira/lira-${name}-poster.jpg`, alt, 3200, 2000),
 motionPreview: true
})
export const liraMedia = {
 quiz: motion('quiz', 'Quiz après lecture : questions, réponses et explications'),
 learn: motion('learn', 'Lectures guidées : niveaux et parcours Learn de Lira'),
 statistics: motion('stats', 'Statistiques de progression : vocabulaire et niveaux dans Lira'),
 context: motion('vocabulary', 'Carnet de vocabulaire : mots, traductions et phrases source'),
 personas: [1,2,3].map(n => ({ ...image(`lira/persona-0${n}.jpg`, `Synthèse exploratoire : profil ${n}, objectifs, frustrations et besoins`), imageScale: .94, figureGap: 24 })),
 banner: { ...image('lira/lira-banner.jpg', 'Lira présenté sur un ordinateur portable'), fit: 'cover' },
 flow: image('lira/flow.jpg','Parcours produit reliant lecture, vocabulaire et révision'),
 reader: motion('translation', 'Traduction en contexte : sélection d’un mot utile puis d’une expression'),
 onboarding: motion('onboarding', 'Onboarding : langue, niveau, lecture d’essai et création de compte'),
 library: motion('library', 'Bibliothèque Lira : livres et progression des lectures'),
 import: motion('import', 'Import d’un EPUB et préparation du contenu avant validation'),
 revision: [motion('review', 'Révision avec traduction et phrase source'), motion('crossword', 'Mots croisés fondés sur le vocabulaire sauvegardé'), motion('stats', 'Statistiques de progression affichées dans le produit')]
}
