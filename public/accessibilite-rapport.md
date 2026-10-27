# Évaluation d’accessibilité — Portfolio 2027

Date : 2 octobre 2026. Évaluation technique interne, sans certification ni taux global de conformité.

## Périmètre et méthode

Les neuf pages publiques : accueil, services, à propos, Lira, MBA Formations, Septième Séance, Talkie, accessibilité et plan du site. Le fichier llms.txt est vérifié séparément pour son encodage.

Chrome et WebKit, viewport 390 et 1440 px pour axe, puis 320 px pour le reflow. Clavier : Tab sous Chrome ; Option-Tab sous WebKit conformément au réglage de parcours des liens de Safari. Texte à 200 %, styles désactivés, espacement de texte et paysage 844 × 390 contrôlés. Pages pré-rendues testées sans JavaScript. Réglage système et commande manuelle persistante de mouvement réduit vérifiés, dont l’arrêt des vidéos et du scroll lissé.

Axe-core 4.14.0 : 36 scans (9 pages × 2 tailles × 2 moteurs), zéro violation automatique relevée. Ces résultats ne valident pas les critères qui exigent une appréciation humaine ou l’utilisation réelle d’une aide technique.

Référentiel : RGAA 4.1.2 (base WCAG 2.1), avec contrôles complémentaires WCAG 2.2.

Sources : [critères et tests RGAA](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) et [WCAG 2.2 du W3C](https://www.w3.org/TR/WCAG22/). Les identifiants des matrices renvoient à ces définitions officielles.

## Corrections réalisées

- Contraste des textes secondaires et de navigation renforcé (#626262) sur blanc et sur les cadres gris.
- Valeurs finales du compteur présentées en texte masqué ; suppression du aria-label invalide sur les dd ; animation visuelle ignorée par les aides techniques.
- Commandes Lire/Pause sur toutes les vidéos des projets et commande globale pour les previews.
- Préférence de mouvement du système respectée ; préférence manuelle persistante ; arrêt des transitions, compteurs et scroll lissé.
- Footer toujours visible, navigation répétée et lien Accessibilité.
- Ressource llms.txt servie en text/plain; charset=utf-8 ; contenu disponible sans caractères corrompus.

## Limites identifiées et travail restant

- **Descriptions longues** : complétées et relues pour les visuels de recherche, personas, parcours et captures. Elles sont associées aux médias par aria-describedby et masquées visuellement. Leur lecture réelle avec une aide technique reste à tester.
- **Démonstrations vidéo** : les exports sont sans piste audio. Des descriptions du déroulement sont désormais reliées aux démonstrations des projets. La vérification de l’équivalence temporelle, écran par écran et sur les deux variantes responsive, reste à terminer ; les résumés ne sont pas présentés comme des transcriptions exhaustives.
- **Aides techniques** : aucun parcours complet VoiceOver/NVDA n’a été effectué. Les noms/rôles dans l’arbre accessible ont été inspectés ; cela ne remplace pas une lecture vocale réelle.
- **Navigation alternative** : plan HTML ajouté et testé ; toutes les pages sont accessibles depuis ce plan, y compris sans JavaScript. Le plan est relié depuis chaque footer.
- **HTML et contrastes** : validés dans le périmètre décrit ci-dessous. Aucun clignotement n’est conçu ; aucune mesure spécialisée des seuils de flash n’est revendiquée.
- **Images de texte** : les captures montrent les interfaces comme objets de design. La revue des contenus utiles est documentée ; elle ne certifie pas l’accessibilité des applications représentées.

## Matrice des 106 critères RGAA

« Vérifié techniquement » signifie que la preuve indiquée a été contrôlée dans ce périmètre ; ce statut ne vaut pas une déclaration juridique de conformité. « Sans objet » concerne les fonctionnalités du portfolio, pas les formulaires ou tableaux représentés dans une capture. « À compléter » et « À vérifier » ne sont pas comptés comme des réussites.

| Critère | Thème | État | Preuve / limite |
| --- | --- | --- | --- |
| 1.1 | Images | Vérifié techniquement | Présence des alternatives contrôlée avec axe ; les previews liées utilisent un nom de lien et des images décoratives ignorées. |
| 1.2 | Images | Vérifié techniquement | Images des previews décoratives avec alt vide ; leurs liens gardent un nom explicite. |
| 1.3 | Images | Vérifié manuellement | Alternatives courtes relues à partir des personas, schémas, synthèses et captures. Extraits recadrés décrits sans prétendre montrer les branches absentes. |
| 1.4 | Images | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 1.5 | Images | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 1.6 | Images | Vérifié techniquement | Descriptions détaillées en texte dans le DOM, reliées aux images par aria-describedby ; masquées visuellement à la demande du propriétaire. |
| 1.7 | Images | Vérifié manuellement | Descriptions comparées aux visuels sources : profils Lira, parcours, recherche Talkie, cadrage et architecture MBA ; contenus significatifs repris en texte. |
| 1.8 | Images | Vérifié manuellement | Captures et mockups utilisés pour montrer les interfaces conçues ; textes et schémas repris dans leurs alternatives. Les images ne remplacent pas les commandes du portfolio. |
| 1.9 | Images | Vérifié techniquement | Association figure/figcaption conservée ; pas de légende vide sur le banner MBA. |
| 2.1 | Cadres | Vérifié techniquement | Le seul iframe intégré (hero MBA) possède un title descriptif. |
| 2.2 | Cadres | Vérifié techniquement | Le titre annonce une démonstration de catalogue et fiche de formation. |
| 3.1 | Couleurs | Vérifié manuellement | Sens des parcours, états de quiz et tableaux explicité par le texte et les alternatives. Aucun contrôle du portfolio identifié uniquement par une couleur. |
| 3.2 | Couleurs | Vérifié techniquement | 36 scans axe sans violation DOM ; 417 états de liens et boutons mesurés, contraste minimal 5,59:1. Les pixels des maquettes externes ne constituent pas une certification des produits représentés. |
| 3.3 | Couleurs | Vérifié manuellement | Focus à double contour noir/blanc (21:1 entre les deux couleurs), contrôlé sur boutons, liens et commandes vidéo. Fonds de cartes et séparateurs sans fonction informative classés décoratifs. |
| 4.1 | Médias | À compléter | Les vidéos sont muettes et décrites par leur nom et le texte de section ; les résumés du déroulement sont associés, mais leur équivalence exhaustive écran par écran reste à vérifier. |
| 4.2 | Médias | À compléter | Les descriptions sont présentes ; comparaison exhaustive avec chaque séquence et variante responsive à poursuivre. |
| 4.3 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.4 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.5 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.6 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.7 | Médias | Vérifié techniquement | Démonstrations identifiées par leur nom accessible et leur légende. |
| 4.8 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.9 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.10 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.11 | Médias | Vérifié techniquement | Boutons Lire/Pause sur les vidéos de projet ; arrêt global des previews depuis le footer ; utilisation clavier testée. |
| 4.12 | Médias | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 4.13 | Médias | À vérifier manuellement | Lecture réelle des médias avec VoiceOver/NVDA non réalisée. |
| 5.1 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 5.2 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 5.3 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 5.4 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 5.5 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 5.6 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 5.7 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 5.8 | Tableaux | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 6.1 | Liens | Vérifié techniquement | Liens projets nommés avec le projet et le visuel ; liens du footer explicites. |
| 6.2 | Liens | Vérifié techniquement | Aucun lien sans nom accessible détecté par axe. |
| 7.1 | Scripts | À vérifier manuellement | Analyse des noms/rôles et de l’arbre accessible réalisée ; interaction avec des lecteurs d’écran réels à poursuivre. |
| 7.2 | Scripts | Vérifié techniquement | Contenu des huit pages disponible dans les HTML pré-rendus sans JavaScript. |
| 7.3 | Scripts | Vérifié techniquement | Commandes natives, lien d’évitement et traversée clavier testés dans les deux moteurs. |
| 7.4 | Scripts | Vérifié techniquement | Les routes et le réglage de mouvement changent sur action explicite ; pas de navigation automatique. |
| 7.5 | Scripts | À vérifier manuellement | Compteurs visuels aria-hidden et valeur finale en texte masqué. Annonce effective des états avec lecteur d’écran à vérifier. |
| 8.1 | Documents | Vérifié techniquement | DOCTYPE HTML présent dans les pages pré-rendues. |
| 8.2 | Documents | Vérifié techniquement | Validateur Nu 26.10.12 du W3C : validation locale du dossier dist, pages, aliases, 404 et scènes intégrées ; zéro erreur et zéro avertissement. |
| 8.3 | Documents | Vérifié techniquement | Langue fr sur chaque document HTML. |
| 8.4 | Documents | Vérifié techniquement | Code de langue cohérent avec les textes français. |
| 8.5 | Documents | Vérifié techniquement | Titre renseigné sur les huit routes. |
| 8.6 | Documents | Vérifié techniquement | Titres propres à chaque page et canonical vérifiés dans le build. |
| 8.7 | Documents | Vérifié manuellement | Page en français ; phrase Product Design & Design Engineering balisée lang=en. Noms propres, logiciels, acronymes et emprunts courants examinés selon les exceptions RGAA. |
| 8.8 | Documents | Vérifié techniquement | Code en pour la phrase anglaise ; langue française fr sur html. Aucun système de locales nécessaire pour ce critère. |
| 8.9 | Documents | Vérifié techniquement | Titres, listes, liens, boutons, descriptions de résultats et figures utilisent des balises de sens. |
| 8.10 | Documents | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 9.1 | Structure | Vérifié techniquement | Un h1 par page ; sections h2 et hiérarchie inspectées. |
| 9.2 | Structure | Vérifié techniquement | Main unique, header, nav nommées et footer disponibles dans l’arbre accessible. |
| 9.3 | Structure | Vérifié techniquement | Listes ul/li et résultats dl/dt/dd ; attribut ARIA interdit sur dd supprimé. |
| 9.4 | Structure | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 10.1 | Présentation | Vérifié techniquement | Inspection du DOM, du CSS et des résultats de navigation ; détails et limites décrits dans la méthode. |
| 10.2 | Présentation | Vérifié techniquement | Contenu des paragraphes conservé après désactivation des styles sur les huit pages dans les deux moteurs. |
| 10.3 | Présentation | Vérifié techniquement | Ordre DOM maintenu sans CSS ; inspection du texte et de la structure, sans revendication de lecture vocale complète. |
| 10.4 | Présentation | Vérifié techniquement | Texte réellement porté à 200 % à 1280 px, sans débordement détecté sur les huit pages. |
| 10.5 | Présentation | Vérifié techniquement | Inspection du DOM, du CSS et des résultats de navigation ; détails et limites décrits dans la méthode. |
| 10.6 | Présentation | Vérifié techniquement | Inspection du DOM, du CSS et des résultats de navigation ; détails et limites décrits dans la méthode. |
| 10.7 | Présentation | Vérifié techniquement | Outline de focus visible ; lien d’évitement et liens de footer atteints au clavier. |
| 10.8 | Présentation | Vérifié techniquement | Previews masquées sur mobile non focusables ; overlays décoratifs ignorés ; verrouillage temporaire de l’intro supprimé en mouvement réduit. |
| 10.9 | Présentation | Vérifié techniquement | Inspection du DOM, du CSS et des résultats de navigation ; détails et limites décrits dans la méthode. |
| 10.10 | Présentation | Vérifié techniquement | Inspection du DOM, du CSS et des résultats de navigation ; détails et limites décrits dans la méthode. |
| 10.11 | Présentation | Vérifié techniquement | Reflow à 320 px (équivalent de 400 % depuis 1280 px) sans débordement horizontal. |
| 10.12 | Présentation | Vérifié techniquement | Surcharges line-height, letter-spacing, word-spacing et marges de paragraphes testées sans débordement. |
| 10.13 | Présentation | À vérifier manuellement | Les overlays n’ajoutent qu’un rappel du lien Voir le projet ; analyse complète des exceptions hover/focus à confirmer. |
| 10.14 | Présentation | Vérifié techniquement | Le rappel Voir le projet apparaît aussi au focus-visible. |
| 11.1 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.2 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.3 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.4 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.5 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.6 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.7 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.8 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.9 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.10 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.11 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.12 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 11.13 | Formulaires | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 12.1 | Navigation | Vérifié techniquement | Navigation principale et plan HTML du site distinct ; lien dans chaque footer, accès aux neuf pages et à llms.txt, navigation vérifiée avec et sans JavaScript. |
| 12.2 | Navigation | Vérifié techniquement | Navigation principale en haut et navigation secondaire en bas, avec le même ordre sur les pages. |
| 12.3 | Navigation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 12.4 | Navigation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 12.5 | Navigation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 12.6 | Navigation | Vérifié techniquement | Landmarks et lien d’évitement disponibles ; focus principal après navigation de route. |
| 12.7 | Navigation | Vérifié techniquement | Aller au contenu testé avec Tab dans Chrome et Option-Tab dans WebKit. |
| 12.8 | Navigation | Vérifié techniquement | Traversée du lien d’évitement et du footer, y compris marche arrière ; pas d’ordre positif artificiel. |
| 12.9 | Navigation | Vérifié techniquement | Pas de modale ou piège de focus ; navigation native par liens et boutons. |
| 12.10 | Navigation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 12.11 | Navigation | Vérifié techniquement | Liens et contrôles atteignables au clavier ; overlay informatif non interactif. |
| 13.1 | Consultation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 13.2 | Consultation | Vérifié techniquement | Ouvertures externes uniquement après clic sur Voir le site. |
| 13.3 | Consultation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 13.4 | Consultation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 13.5 | Consultation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 13.6 | Consultation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |
| 13.7 | Consultation | À vérifier manuellement | Pas d’effet de flash conçu dans les motions ; mesure spécialisée des seuils de luminosité non réalisée. |
| 13.8 | Consultation | Vérifié techniquement | Commande globale persistante pour arrêter les animations ; boutons vidéo et préférence système respectés. |
| 13.9 | Consultation | Vérifié techniquement | Portrait/mobile et paysage 844 × 390 vérifiés, sans restriction d’orientation. |
| 13.10 | Consultation | Vérifié techniquement | Pas de geste complexe requis pour une fonction ; navigation par liens/boutons. |
| 13.11 | Consultation | Vérifié techniquement | Activation sur click natif, pas sur pointerdown ; possibilité d’annuler en quittant la cible. |
| 13.12 | Consultation | Sans objet | Absence de la fonctionnalité concernée dans le portfolio (hors interfaces représentées en image). |

## Matrice WCAG 2.2

Tous les identifiants de la recommandation sont répertoriés, y compris le critère 4.1.1 retiré. Le niveau AAA est hors cible ; il n’est pas présenté comme validé. Les contrôles RGAA ci-dessus fournissent les preuves détaillées ; les règles nouvelles de WCAG 2.2 sont distinguées.

| Critère | Niveau | État | Preuve / limite |
| --- | --- | --- | --- |
| 1.1.1 | A | Vérifié manuellement | Alternatives courtes et descriptions longues relues et associées aux médias ; captures d’interfaces traitées comme objets de design. |
| 1.2.1 | A | À compléter | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.2 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.3 | A | À compléter | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.4 | AA | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.5 | AA | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.6 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.7 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.8 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.2.9 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.3.1 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.3.2 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.3.3 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.3.4 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.3.5 | AA | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.3.6 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.1 | A | À vérifier manuellement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.2 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.3 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.4 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.5 | AA | À vérifier manuellement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.6 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.7 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.8 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.9 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.10 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.11 | AA | Vérifié manuellement | Focus à double contour noir/blanc (21:1 entre les deux couleurs), contrôlé sur boutons, liens et commandes vidéo. Fonds de cartes et séparateurs sans fonction informative classés décoratifs. |
| 1.4.12 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 1.4.13 | AA | À vérifier manuellement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.1.1 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.1.2 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.1.3 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.1.4 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.2.1 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.2.2 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.2.3 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.2.4 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.2.5 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.2.6 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.3.1 | A | À vérifier manuellement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.3.2 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.3.3 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.1 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.2 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.3 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.4 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.5 | AA | Vérifié techniquement | Navigation principale et plan HTML du site distinct ; lien dans chaque footer, accès aux neuf pages et à llms.txt, navigation vérifiée avec et sans JavaScript. |
| 2.4.6 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.7 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.8 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.9 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.10 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.11 | AA | À vérifier manuellement | Lien du footer placé dans le viewport au focus ; autres cas de recouvrement à confirmer avec les aides techniques. |
| 2.4.12 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.4.13 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.1 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.2 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.3 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.4 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.5 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.6 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.7 | AA | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 2.5.8 | AA | À vérifier manuellement | Commandes vidéo au moins 44 × 32 px, liens du footer 32 px de haut ; exceptions d’espacement de tous les liens à examiner. |
| 3.1.1 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.1.2 | AA | Vérifié manuellement | Page en français ; phrase Product Design & Design Engineering balisée lang=en. Noms propres, logiciels, acronymes et emprunts courants examinés selon les exceptions RGAA. |
| 3.1.3 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.1.4 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.1.5 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.1.6 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.2.1 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.2.2 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.2.3 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.2.4 | AA | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.2.5 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.2.6 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.1 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.2 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.3 | AA | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.4 | AA | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.5 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.6 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.7 | A | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.8 | AA | Sans objet | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 3.3.9 | AAA | Hors cible AA | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 4.1.1 | — | Retiré de WCAG 2.2 | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 4.1.2 | A | Vérifié techniquement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |
| 4.1.3 | AA | À vérifier manuellement | Voir les preuves RGAA et les tests joints ; aucune conformité totale déduite des seuls tests automatisés. |

## Pièces et reproductibilité

- Résultats bruts : verification/accessibility-results.json.
- Complément zoom, orientation et CSS : verification/accessibility-manual.json.
- Matrices : verification/accessibility-criteria.json.
- Commande : npm run verify:a11y (TEST_URL peut cibler un aperçu local).
- Captures visuelles inspectées pour la page Accessibilité, le footer mobile et les pages projet.

Pour signaler une difficulté : hello@pierredelattre.fr, avec la page, le navigateur, l’appareil et l’aide technique concernée.


## Contrôles complémentaires du 2 octobre 2026

### Validation HTML

Nu Html Checker 26.10.12 (973e40b), exécuté localement sur tout le dossier de production `dist`, sans transmission des pages à un service distant : **zéro erreur, zéro avertissement**. Les erreurs d’en-têtes imbriqués dans role=img dans les scènes MBA ont été corrigées ; les conteneurs de mise en page sans titre ne sont plus des sections documentaires. La validation inclut les neuf pages, leurs alias, la 404 et les quatre documents des scènes.

### Contrastes graphiques et états

417 états mesurés sur les liens et boutons des neuf pages : repos, survol et focus. Calcul de luminance WCAG à partir des couleurs calculées dans Chrome, avec composition alpha des fonds. Contraste minimal mesuré des textes de commandes : **5,59:1** ; les 417 mesures dépassent 4,5:1. Les zones de maquette dans les images et le contenu des iframes ne sont pas assimilés à des contrôles du portfolio.

Le focus utilise un contour noir entouré d’une réserve blanche : **21:1 entre les deux couleurs**, pour conserver un repère sur les fonds clairs ou sombres. Contrôles manuels : liens de navigation, boutons primaire/secondary et Lire/Pause ; captures de focus sur la page Accessibilité en 390 et 1440 px. Les blocs gris de présentation et séparateurs fins ne portent pas une information indispensable à eux seuls : leur contraste avec le blanc n’est pas évalué comme celui d’une commande. Les limites d’une éventuelle perception réelle avec une aide technique restent ouvertes.

Les personas, tableaux et schémas sources ont été inspectés visuellement. Les captures Talkie contiennent notamment des éléments atténués ou peu contrastés : ils sont conservés comme documents montrant le design, et leur information utile est reprise en texte associé. Aucun taux de conformité des produits représentés n’est déduit de cette revue.

### Langue et navigation

`html lang="fr"` sur les neuf pages ; `lang="en"` pour la phrase anglaise du header. Les noms de produits, acronymes et emprunts usuels ne nécessitent pas un changement de locale. Le plan du site est une seconde voie de navigation globale, distincte des menus : liens directs vers toutes les pages et llms.txt ; navigation complète sans JavaScript testée dans Chrome et WebKit.

### Preuves supplémentaires

- `verification/html-validation.json` : sortie du validateur Nu.
- `verification/contrast-results.json` : couleurs et rapports mesurés par état.
- `verification/accessibility-content.json` : associations des descriptions, bouton secondary et couverture du plan du site.
