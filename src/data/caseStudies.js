import { image, video } from './media'
import { mediaDescriptions } from './mediaDescriptions'

const septiemeIntro = {
 ...video('septiemeseance/septieme-intro-roomy.mp4', 'septiemeseance/septieme-intro-roomy-poster.jpg', 'Septième Séance : films à l’affiche, filtre de langue et comparaison des horaires autour de soi', 1600, 1000),
 introMotion: true,
 replayControl: true,
 description: mediaDescriptions['septiemeseance/septieme-intro.mp4'],
 reducedMotionPoster: image('septiemeseance/septieme-intro-roomy-still.jpg', '').src
}

const septiemeHome = { ...septiemeIntro, fill: true, zoom: 1.35, safeFrameWidth: 1240 / 2200 }

export const septiemeSeance = {
 title: 'Septième Séance', name: 'Septième Séance', domain: 'Cinéma', year: '2025', route: '/projet/septiemeseance', layout: 'three',
 objective: 'Trouver rapidement une séance de cinéma autour de soi, selon ses envies et ses contraintes.',
 services: ['Product Design', 'Recherche utilisateur', 'UI Design'], tools: ['Figma', 'ChatGPT', 'Vercel'],
 collaborators: ['Mathieu Lefebvre – UI Design & conseil'],
 hero: { ...septiemeIntro, frameRatio: '16 / 10', fit: 'cover', zoom: 1.3 },
 theme: { hero: '#eee7d8', footer: '#322b20' },
 previews: [
  { key: 'cover', label: 'Découvrir Septième Séance', background: '#eee', media: septiemeHome },
  { key: 'sessions', imageScale: 1.8, mobileImageScale: 1.35, label: 'Les séances', media: image('septiemeseance/projections.jpg', 'Sélection des projections de cinéma') },
  { key: 'alerts', imageScale: 2.5, mobileImageScale: 2, label: 'Alertes de projection', mobile: false, media: image('septiemeseance/alertes.jpg', 'Exploration des alertes de projection') }
 ],
 intro: { title: 'Décider vite parmi trop d’informations', text: 'Savoir quoi voir maintenant ou ce soir demande de croiser les films, les lieux et les horaires. Septième Séance réunit ces informations pour arriver rapidement à une séance possible. Les filtres resserrent la sélection selon le film, le périmètre de recherche et la langue de projection.', figures: [
  { media: image('septiemeseance/filter-films.jpg', 'Filtrer les films à l’affiche'), caption: 'Choisir les films' },
  { media: image('septiemeseance/filter-perimetre.jpg', 'Définir le périmètre de recherche'), caption: 'Définir le périmètre' },
  { media: image('septiemeseance/filter-langue.jpg', 'Choisir la langue de projection'), caption: 'Préciser la langue de projection' }
 ] },
 sections: [
  { title: 'Une réponse utile en quelques interactions', text: 'Le produit privilégie une information actionnable : le lieu, la séance et les contraintes de projection. La compacité des résultats répond à une intention urgente : comparer les possibilités et choisir une séance sans parcourir un inventaire d’informations.', media: image('septiemeseance/projections.jpg', 'Liste des projections et horaires disponibles'), caption: 'Des séances directement comparables' },
  { title: 'Deux entrées pour la même demande', text: 'La géolocalisation permet de trouver immédiatement les séances autour de soi. La recherche manuelle répond aux intentions déjà orientées vers un film, un lieu ou un cinéma. Ces deux entrées rejoignent la même sélection de projections.', media: { ...video('septiemeseance/septieme-geoloc.mp4', 'septiemeseance/septieme-geoloc-poster.jpg', 'Géolocalisation puis affichage des cinémas et horaires autour de soi'), motionPreview: true, reducedMotionPoster: image('septiemeseance/septieme-geoloc-still.jpg', '').src } }
 ]
}

export const talkie = {
 title: 'Talkie', name: 'Talkie', domain: 'Apprentissage', year: '2024', route: '/projet/talkie', layout: 'three',
 objective: 'Rendre la progression dans l’apprentissage des langues plus visible, grâce à des parcours contextualisés et des repères cohérents.',
 services: ['UI Design', 'Design System'], tools: ['Figma', 'Zeroheight'],
 collaborators: ['Grégoire De Gaiffier – UX Designer'],
 hero: { ...image('talkie/banner.jpg', 'Présentation de l’application Talkie'), fit: 'cover' },
 theme: { hero: '#dcedf1', footer: '#123540' },
 previews: [
  { key: 'cover', label: 'Application', media: { ...image('talkie/banner.jpg', 'Présentation de l’application Talkie'), fit: 'cover' } },
  { key: 'features', imageScale: 2, mobileImageScale: 1.75, label: 'Parcours d’apprentissage', media: image('talkie/apprentissage.jpg', 'Nouveaux écrans des parcours d’apprentissage Talkie') },
  { key: 'quiz', imageScale: 2, mobileImageScale: 1.75, label: 'Quiz', mobile: false, media: image('talkie/quiz.jpg', 'Réponses et feedback dans les quiz Talkie') }
 ],
 intro: { title: 'Rendre le progrès perceptible', text: 'Revenir régulièrement dans une application ne suffit pas toujours à sentir que l’on avance. Talkie explore des étapes, des exercices et des retours plus lisibles. Ce projet de spécialisation articule les parcours d’apprentissage avec un design system commun, pour garder des repères cohérents entre les formats.', figures: [
  { media: image('talkie/apprentissage.jpg', 'Parcours d’apprentissage Talkie'), caption: 'Parcours d’apprentissage' },
  { media: image('talkie/quiz.jpg', 'Interface de quiz Talkie'), caption: 'Exercices et quiz' },
  { media: image('talkie/résultat.jpg', 'Duel Talkie : question illustrée, choix des joueurs et scores'), caption: 'Réponses des joueurs et scores' }
 ] },
 sections: [
  { title: 'Partir d’une recherche exploratoire', text: 'Trois entretiens de 30 minutes avec des utilisateurs actifs d’applications concurrentes ont fait émerger quatre signaux : difficulté à dépasser les acquis, répétition, contenu trop généraliste et progression peu visible. Ces observations ont servi d’hypothèses de départ pour orienter la conception.', media: image('talkie/entr.jpg', 'Synthèse des entretiens exploratoires Talkie'), caption: 'Les signaux issus des trois entretiens' },
  { title: 'Varier les formats, garder les repères', text: 'Cours guidés, quiz, quêtes et interactions sociales répondent à différents moments de l’apprentissage. L’enjeu est de relier ces formats dans un parcours compréhensible : apprendre, pratiquer, puis percevoir son avancée. Les composants et principes d’interface communs soutiennent cette cohérence.', media: image('talkie/flows.jpg', 'Parcours et architecture de l’expérience Talkie', 'talkie/mobile-flows.jpg'), caption: 'Des parcours reliés par des repères communs' }
 ]
}

const mbaMain = {
 ...video('mba/mba-intro-roomy.mp4', 'mba/mba-intro-roomy-poster.jpg', 'MBA : catalogue, fiche formation, financement et édition Keystatic'),
 description: mediaDescriptions['motion:mba-preview'], introMotion: true,
 reducedMotionPoster: image('mba/mba-intro-roomy-still.jpg', '').src
}
const mbaHome = { ...mbaMain, fill: true, zoom: 1.35, safeFrameWidth: 1240 / 2200 }
const mbaFunding = { ...video('mba/mba-financement.mp4', 'mba/mba-financement-poster.jpg', 'Financement selon le profil : demandeur d’emploi et conditions AIF', 1600, 1000), motionPreview: true }
const mbaEditor = { ...video('mba/mba-keystatic.mp4', 'mba/mba-keystatic-poster.jpg', 'Champs de planning Keystatic et fiche formation publique', 1600, 1000), motionPreview: true }

export const mbaFormations = {
 title: 'MBA Formations', name: 'MBA Formations', domain: 'Formation pro', year: '2026', route: '/projet/mba-formations', layout: 'three',
 objective: 'Clarifier les parcours de formation pour aider chaque visiteur à identifier une offre et à prendre contact avec confiance.',
 services: ['Product Design', 'Design Engineering', 'Architecture de l’information'], tools: ['Figma', 'Claude Code', 'Hubspot', 'Keystatic', 'Cloudflare'],
 hero: { ...mbaMain, frameRatio: '16 / 10', fit: 'cover', zoom: 1.3 },
 theme: { hero: '#b8c5dd', footer: '#0a2540' },
 previews: [
  { key: 'cover', label: 'MBA Formations', media: mbaHome },
  { key: 'training', imageScale: 2.5, mobileImageScale: 2, label: 'Fiche formation', media: { ...image('mba/mba-formation-desktop.jpg', 'Fiche formation Assistant commercial : programme, certification et candidature'), radius: 9 } },
  { key: 'catalogue', imageScale: 2.5, mobileImageScale: 2, label: 'Catalogue de formations', mobile: false, media: { ...image('mba/mba-catalogue-desktop.jpg', 'Catalogue Commerce et Vente : comparaison des formations'), radius: 9 } }
 ],
 intro: { title: 'Rendre une offre complexe plus facile à choisir', text: 'Comprendre une formation, la relier à sa situation, identifier les possibilités de financement et savoir comment prendre contact : le parcours doit aider à décider sans imposer un catalogue décourageant. Ma contribution ciblée porte sur la clarification des parcours, les pages familles, les fiches formation et les composants, puis sur une extension dédiée à l’acquisition organique.', figures: [
  { media: image('mba/mba-contexte-contraintes.jpg', 'Contexte et contraintes du projet MBA Formations'), caption: 'Contexte et contraintes' },
  { media: image('mba/mba-frictions.jpg', 'Frictions identifiées dans les parcours de formation'), caption: 'Freins à la décision' },
  { media: image('mba/mba-personas.jpg', 'Quatre profils de visiteurs MBA Formations'), caption: 'Situations et besoins des visiteurs' }
 ] },
 sections: [
  { title: 'Ce qui a orienté les parcours', text: 'L’analyse de six concurrents et de quatre profils (reconversion, salarié en évolution, porteur de projet et employeur ou RH) a orienté le cadrage. Le financement difficile à trouver, la surcharge du catalogue, la faible réassurance et un contact peu contextualisé ont guidé les priorités de conception.', media: image('mba/mba-cadrage.jpg', 'Cadrage des objectifs et parcours MBA Formations'), caption: 'Un cadrage fondé sur les besoins et les frictions' },
  { title: 'Partir de l’intention de la personne', text: 'Avant d’exposer l’ensemble de l’offre, les portes d’entrée doivent aider chacun à se reconnaître dans un besoin ou une situation. Les principes de conception rapprochent le choix de formation, les informations de financement et l’action suivante pour rendre le parcours plus clair.', media: image('mba/mba-principes.jpg', 'Principes de conception des parcours MBA Formations', 'mba/mobile-mba-principes.jpg'), caption: 'Les principes qui structurent les parcours' }
 ]
}


const figure = (path, caption, mobile) => ({ media: image(path, caption, mobile), caption })
const browserFigure = (path, caption) => ({ media: { ...image(path, caption), radius: 9, imageScale: .9, figureGap: 24 }, caption })

septiemeSeance.remaining = [
 { layout: 'scroll', title: 'Passer d’un inventaire à une sélection possible', text: 'Les filtres accompagnent une décision concrète : trouver un film qui correspond à ses envies, dans une zone accessible et à un horaire possible. Le périmètre et la date réduisent les options, puis la langue et les sous-titres précisent les conditions de projection. La liste se resserre au fil des choix.', figures: [
  figure('septiemeseance/filter-seances.jpg', 'Préciser les contraintes de séance'),
  figure('septiemeseance/filter-perimetre.jpg', 'Ajuster la zone et la date'),
  figure('septiemeseance/filter-langue.jpg', 'Affiner la langue et les sous-titres')
 ] },
 { layout: 'two', title: 'Privilégier la confiance dans les informations', text: 'Les prix ont été retirés et l’intégration Letterboxd abandonnée : la couverture des données ne permettait pas de les afficher de manière fiable. Une information incomplète aurait donné une fausse précision au moment de choisir. Le parcours distingue également une recherche sans résultat d’une sélection de séances disponibles.', figures: [
  figure('septiemeseance/filter-empty.jpg', 'Recherche sans séance disponible'),
  figure('septiemeseance/filter-results.jpg', 'Résultats après application des filtres')
 ] },
 { layout: 'split', title: 'Un besoin révélé après le lancement', text: 'Le produit a été lancé autour de la recherche d’une séance immédiate. Les tests ont ensuite fait apparaître une autre intention : rechercher directement un cinéma et consulter sa programmation sur plusieurs jours. Ce retour a orienté la suite envisagée vers une recherche cinéma avec autocomplétion et des pages dédiées.', figures: [figure('septiemeseance/projections.jpg', 'Le point de départ : les projections autour de soi')] },
 { layout: 'text', title: 'La continuité des données fait partie du produit', text: 'Une restriction d’accès à l’API a conduit à l’arrêt du service. L’intégration d’une autre source n’était pas réaliste dans le temps disponible. Ce projet a mis en évidence une contrainte qui dépasse les interfaces : la disponibilité, le coût et la continuité des données conditionnent la durée de vie d’un service d’information.' },
 { layout: 'three', title: 'Les pistes qui auraient prolongé le service', text: 'Après la recherche cinéma et les programmes sur plusieurs jours, des alertes et des enrichissements ciblés auraient aidé à retrouver une projection ou à choisir un film. Ces écrans présentent des pistes explorées, non livrées. L’intégration Letterboxd reste une exploration abandonnée.', figures: [
  figure('septiemeseance/alertes.jpg', 'Piste : alertes de projection'),
  figure('septiemeseance/notes.jpg', 'Piste : notes et critiques'),
  figure('septiemeseance/letterboxd.jpg', 'Exploration abandonnée : Letterboxd API')
 ] }
]

talkie.remaining = [
 { layout: 'two', title: 'Des composants communs pour apprendre et pratiquer', text: 'Les exercices en solo et les duels utilisent les mêmes briques : cartes, progression, modules de quiz et navigation. Chaque écran hiérarchise les informations autour d’une action principale et d’un retour clair. Le format change, mais les repères restent familiers.', figures: [
  figure('talkie/quiz.jpg', 'Pratiquer avec un quiz en solo'),
  figure('talkie/duels.jpg', 'Pratiquer dans un duel')
 ] },
 { layout: 'full', label: 'Des repères communs, d’un écran à l’autre.', title: 'Le design system comme outil de collaboration', text: 'À deux designers sur cinq sections (Accueil, Apprendre, Quiz, Quêtes et Profil) il fallait garder des décisions cohérentes. Nous avons construit des fondations, des composants documentés par usage et des templates communs. La documentation Zeroheight, synchronisée depuis Figma, rend ces choix accessibles pour composer les écrans et leurs états.', figures: [{ media: image('talkie/designsystem.jpg', 'Design system Talkie') }] },
 { layout: 'split', inverse: true, title: 'Observer les frictions, puis ajuster les parcours', text: 'Trois participants ont testé deux parcours et complété les scénarios sans blocage majeur. L’entrée dans les quiz manquait de clarté : elle a été retravaillée. Les frictions autour de l’invitation d’amis et de la reprise de cours ont orienté les améliorations des fins de parcours. Les titres et états manquants ont été ajoutés pour mieux situer l’utilisateur.', figures: [figure('talkie/tests.jpg', 'Observations des tests et itérations')] },
 { layout: 'text', title: 'Un système qui relie les parcours', text: 'Talkie réunit une recherche exploratoire, des prototypes desktop et mobile et un design system documenté. Le travail montre comment des décisions réutilisables peuvent soutenir plusieurs formats d’apprentissage, tout en gardant une expérience cohérente et une collaboration plus simple entre designers.' }
]

mbaFormations.remaining = [
 { layout: 'two', title: 'Organiser les pages familles autour des besoins', text: 'Les pages familles relient les intentions des visiteurs aux formations pertinentes. Elles structurent le passage de l’accueil à la fiche formation et donnent un premier niveau de comparaison. L’architecture sert de fil conducteur : identifier son besoin, comprendre l’offre, puis choisir la suite du parcours.', figures: [
  figure('mba/mba-arbo.jpg', 'Architecture des parcours de formation', 'mba/mobile-mba-arbo.jpg'),
  browserFigure('mba/mba-catalogue-desktop.jpg', 'Page famille de formations')
 ] },
 { layout: 'split', inverse: true, title: 'Faire du financement une information de décision', text: 'Le financement compte dès le choix d’une formation. Le placer au bon moment du parcours aide le visiteur à évaluer la faisabilité de son projet avant la prise de contact. La fiche rapproche cette information du contenu de la formation et des éléments de réassurance.', figures: [{ media: mbaFunding, caption: 'Identifier les dispositifs selon sa situation' }] },
 { layout: 'two', title: 'Une fiche formation qui prépare la prise de contact', text: 'La fiche formation doit permettre de comprendre ce que l’on va apprendre, vérifier les conditions et savoir comment avancer. Les contenus, les appels à l’action et les composants sont pensés dans cette continuité : accompagner la décision, puis faciliter le contact avec l’organisme. Les informations recueillies alimentent ensuite le CRM, la notification à l’équipe et un rapport automatisé sur les financements, les contrats possibles et les prochaines sessions.', figures: [
  browserFigure('mba/mba-formation-desktop.jpg', 'Présentation de la formation'),
  figure('mba/mba-contact-flow.jpg', 'De la prise de contact au rapport automatisé')
 ] },
 { layout: 'full', label: 'Comprendre la formation avant de s’engager.', title: 'Présenter les informations dans leur contexte', text: 'La fiche réunit les informations essentielles pour situer la formation, vérifier ses modalités et engager la suite du parcours.', figures: [{ media: { ...image('mba/mba-banner.jpg', 'Fiche formation MBA présentée sur un ordinateur portable'), fit: 'cover' } }] },
 { layout: 'split', inverse: true, title: 'Relier les contenus à la fiche publique', text: 'Les champs Format & planning de Keystatic (Back-office) structurent les informations utiles à la décision. Leur publication alimente la fiche formation avec des repères cohérents sur la durée, le rythme et les prochaines sessions.', figures: [{ media: mbaEditor, caption: 'Des champs de planning au rendu public' }] },
 { layout: 'scroll', title: 'Prolonger les parcours par l’acquisition organique', text: 'En fin de mission, le périmètre s’est étendu à des landing pages, des pages géolocalisées et un blog simple. Ces portes d’entrée répondent à des recherches ciblées et rejoignent les parcours de formation. L’objectif est de capter un trafic qualifié et de l’amener vers une offre pertinente. Des données structurées décrivent les formations, les articles et les fils d’Ariane pour faciliter leur compréhension par les moteurs de recherche et préparer les contenus aux résultats enrichis Google (rich snippets).', figures: [
  browserFigure('mba/mba-metier-desktop.jpg', 'Landing page dédiée à une intention'),
  figure('mba/mba-local-queries.jpg', 'Exemples de requêtes locales ciblées'),
  browserFigure('mba/mba-blog-desktop.jpg', 'Article ou index du blog')
 ] },
 { layout: 'text', title: 'Préparer le suivi des parcours et de l’acquisition', text: 'Le suivi repose sur Analytics et un plan de taggage pour mesurer les parcours sur le site, les interactions avec les formations et les prises de contact. Le tracking des campagnes mailing relie les messages aux visites et aux actions réalisées sur le site, afin de suivre les points d’entrée et les conversions.' },
]

const sizeFigures = (items, scale, maxHeight = 320) => items.forEach(item => {
 item.media = { ...item.media, imageScale: scale, maxHeight, figureGap: 24 }
})
sizeFigures(septiemeSeance.intro.figures, .9)
septiemeSeance.sections.forEach(section => { section.media = { ...section.media, imageScale: .9, figureGap: 24 } })
septiemeSeance.remaining.forEach(section => {
 if (section.figures) sizeFigures(section.figures, section.title === 'Les pistes qui auraient prolongé le service' ? .6 : .9)
})
septiemeSeance.remaining.splice(1, 0, {
 layout: 'full', label: 'Trouver une séance près de soi, selon ses envies.', title: 'La recherche de séances dans son contexte',
 text: 'Une interface qui réunit les films, les lieux et les horaires pour comparer les séances autour de soi.',
 figures: [{ media: { ...image('septiemeseance/002.jpg', 'Septième Séance présenté sur un ordinateur portable'), fit: 'cover' } }]
})
sizeFigures(talkie.intro.figures, .9)
sizeFigures(talkie.remaining[0].figures, .9)
