# Plan — Rendre le prototype livrable à un développeur

Objectif : livrer un prototype front propre, sans bug d'interface, avec des points
d'intégration serveur/API **clairement isolés et documentés** pour que le dev
branche le back-end sans avoir à fouiller le code.

Conventions suivies (déduites du code, pas de doc d'architecture fournie) :
composants par dossier (`sections/`, `layout/`, `modals/`, `hero/`, `brand/`) avec
barrels `index.ts`, données statiques dans `src/data/zenikaData.ts`, types dans
`src/types.ts`, Tailwind v4 + `cn()`, i18n par prop `lang` (`fr` / `en`) et
ternaires `lang === 'fr' ? … : …`.

## Étape 0 — Filet de sécurité
- [x] `git init` + commit initial de l'état actuel (le projet n'est pas versionné : sans ça, aucune modif n'est réversible ni relisible par le dev) et `npm install` pour pouvoir lancer `tsc` / `vite build`

## Étape 1 — Point d'intégration API unique (le dev branchera ici)
- [x] Créer `src/services/leads.ts` : type `LeadPayload` (nom, email, société, téléphone, message, ville/agence, besoin, offres/modèle sélectionnés, source du formulaire) + fonction `submitLead(payload): Promise<void>` en **stub** (délai simulé + `console.info`), avec un gros `TODO(backend)` expliquant quoi brancher
- [x] Faire passer les 4 formulaires par `submitLead` : `ContactSection`, `AvantProjetWorkflowModal` (formulaire + bot), `ZenikaTrainingBotWidget` — avec état d'erreur affiché si la promesse échoue (au lieu d'un succès systématique)

## Étape 2 — Bugs fonctionnels front
- [x] Transmettre l'offre sélectionnée au formulaire de contact (`Version1Fluid.tsx:296`, `() => onOpenContact()` perd l'argument) et remonter le panier « Ajouter à mon projet »
- [x] Afficher le nom du modèle dans le badge (`AvantProjetWorkflowModal.tsx:223`, `.name` → `title` / `titleEn`)
- [x] Corriger les liens `tel:` qui gardent le `(0)` (`AgenciesSection.tsx:223`)
- [x] Corriger les cibles `#solutions` inexistantes (Version1Fluid, StrategicAxesSection, HeroIntroVideoScroll, Navbar) → pointer vers la vraie section
- [x] Bouton desktop « Découvrir les offres » qui vise un bloc caché en desktop (`StrategicAxesSection.tsx:1385`) → cible visible en desktop
- [x] Sections d'offres mobiles qui se referment au moindre resize (`StrategicAxesSection.tsx:219`) → ne réagir qu'au changement de breakpoint
- [x] *(ajout)* Supprimer en mobile le composant « 3 piliers / 7 Frictions / 6 ROIs », doublon du Catalogue d'interventions
- [x] *(ajout)* Desktop : sélecteur prototype « A · Animation des piliers / B · Catalogue d'interventions » (une seule des deux affichée, partageable via `?piliers=catalogue`) — **choix à faire en équipe, puis supprimer le sélecteur et la version écartée**
- [x] Bot : la fermeture via le lien footer désynchronise l'état externe (`ZenikaTrainingBotWidget.tsx:387`)
- [x] Navbar : closure périmée sur `mobileMenuOpen` (`Navbar.tsx:51`) + logo `href="/"` → `import.meta.env.BASE_URL`
- [x] Portfolio : flèches clavier actives derrière la démo plein écran (`PortfolioShowcaseSection.tsx:111`)

## Étape 3 — Modales
- [x] Hook partagé `useModalBehavior` (Échap pour fermer + verrouillage du scroll + retour du focus) appliqué à AvantProjetWorkflowModal, modale Agences, modale projet Version1Fluid

## Étape 4 — Intro hero
- [x] Ajouter un bouton « Passer l'intro » à la V3 et corriger le chevauchement des deux strophes (`HeroIntroVideoScroll.tsx:389`). Les variantes V1/V2/V4 sont conservées mais documentées comme non utilisées

## Étape 5 — Qualité / CI
- [x] Corriger les erreurs `tsc` restantes pour que `npm run lint` passe, et ajouter l'étape `npm run lint` dans `.github/workflows` avant le build

## Étape 6 — Documentation de passation
- [x] Réécrire `README.md` (actuellement le README générique AI Studio qui parle d'une `GEMINI_API_KEY` inutilisée) : lancement, structure, où sont les données, **liste des TODO back-end** (endpoint leads, données « live » en dur : formations datées mars–avril 2026, offres d'emploi, meetups, fallback démo `cube-v.vercel.app`), limites connues (traductions EN incomplètes, variantes d'intro inutilisées)
