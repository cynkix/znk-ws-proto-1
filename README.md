# Zenika — prototype du site corporate

Prototype **front-end uniquement** (React 19 + Vite 6 + TypeScript + Tailwind CSS v4 + `motion` + three.js).
Aucun back-end : tout le contenu est statique, et les formulaires ne transmettent encore rien.
Ce README liste ce qu'il reste à brancher côté serveur et les limites connues.

## Lancer le projet

Prérequis : Node.js 20 (version utilisée par la CI).

```bash
npm ci            # installe les dépendances (package-lock.json fait foi)
npm run dev       # serveur de dev sur http://localhost:3000 (accessible sur le réseau local)
npm run lint      # vérification des types (tsc --noEmit)
npm run build     # build de production dans dist/
npm run preview   # sert le build de production en local
```

Aucune variable d'environnement n'est nécessaire aujourd'hui.

## Déploiement

`.github/workflows/deploy.yml` : à chaque push sur `main`/`master`, la CI lance `npm ci`, `npm run lint`, `npm run build`,
puis publie `dist/` sur **GitHub Pages**. `vite.config.ts` utilise `base: './'` pour que le site fonctionne sous un
sous-chemin (`https://<org>.github.io/<repo>/`) : les assets et liens internes doivent rester relatifs
(`import.meta.env.BASE_URL`), jamais en `/…` absolu.

## Structure

```
src/
  App.tsx                  page unique : hero, navbar, contenu, footer, bot, modale de contact
  components/
    hero/                  intro plein écran (seule la V3 HeroIntroVideoScroll est utilisée)
    layout/                Navbar, Footer, Version1Fluid (assemble toutes les sections), ParallaxBackground
    sections/              une section de page par fichier (piliers, portfolio, partenaires, agences, contact…)
    modals/                modale de contact/cadrage, bot, communication 20 ans, slide triple compétence
    brand/                 logos et monogrammes Zenika en SVG
  data/zenikaData.ts       contenu statique : offres, modèles d'intervention, références clients, partenaires, agences
  services/leads.ts        ⚠️ point d'intégration des formulaires (stub, voir ci-dessous)
  lib/                     utilitaires (cn, toTelHref) et hook useModalBehavior
  context/ThemeContext.tsx thème clair/sombre (persisté dans localStorage)
  types.ts                 types partagés
```

Conventions : un composant par fichier, barrels `index.ts` par dossier, Tailwind + `cn()` pour les classes,
i18n par prop `lang: 'fr' | 'en'` et ternaires `lang === 'fr' ? … : …` (pas de librairie i18n).

## TODO back-end

### 1. Envoi des demandes de contact — prioritaire

Les 4 formulaires passent par **une seule fonction**, `submitLead(payload)` dans `src/services/leads.ts` :

| Formulaire | `source` |
|---|---|
| Section Contact en bas de page | `contact-section` |
| Modale de cadrage — formulaire classique | `scoping-modal-form` |
| Modale de cadrage — assistant (bot) | `scoping-modal-bot` |
| Bot flottant | `floating-bot` |

Aujourd'hui c'est un **stub** : délai simulé de 700 ms, puis `console.info` du payload. **Rien ne quitte le navigateur.**
Contrat attendu par l'UI : la promesse résout → écran de succès ; elle rejette → message d'erreur et nouvel essai possible.
Le type `LeadPayload` décrit toutes les données collectées (coordonnées, besoin, agence, réponses du bot,
identifiants des offres/modèle présélectionnés).

À prévoir côté serveur : validation, anti-spam (captcha / honeypot / rate limiting), consentement et durée de
conservation RGPD, notification de l'équipe commerciale (CRM, e-mail…).

### 2. Contenu « live » écrit en dur

Ces blocs ont l'air dynamiques mais sont codés en dur ; ils sont à brancher sur une source de données ou un CMS :

- **`EcosystemLiveSection.tsx`** — offres d'emploi, prochaines sessions de formation, événements/meetups, blog.
  ⚠️ Les formations affichées comme « à venir » sont datées **24–26 mars, 7–9 avril et 14–16 avril 2026** : elles sont déjà passées.
- **`src/data/zenikaData.ts`** — offres, références clients (dont la démo live `cube-v.vercel.app` et les vidéos YouTube),
  partenaires, agences (adresses et téléphones).

## Décision produit en attente

**Section « 3 piliers » en desktop : version A ou B.** En desktop, un sélecteur temporaire « Prototype · Version desktop »
(juste après « Notre valeur ») permet de comparer :

- **A · Animation des piliers** (par défaut) : animation épinglée au scroll, piliers / frictions / ROI ;
- **B · Catalogue d'interventions** : cartes dépliables et les 12 offres (c'est aussi la seule version affichée en mobile).

Lien direct vers la version B : `?piliers=catalogue`. Dans la version A, « Découvrir les offres » bascule vers la B,
seul endroit où les offres existent. **Une fois le choix fait**, supprimer le sélecteur, la version écartée et le
paramètre d'URL (`desktopVariant` dans `StrategicAxesSection.tsx`, commentaire `PROTOTYPE`).

## Limites connues

- **Traductions anglaises incomplètes** : réponses proposées par les bots, libellés de la section Contact et du
  récapitulatif, Heritage, cartes de la communication 20 ans, popovers de la slide triple compétence. Dans l'intro,
  les mots mis en valeur suivent les positions françaises, donc certains mots anglais sont mal accentués.
- **Panier « Ajouter à mon projet »** : il est transmis au formulaire depuis les sections de la page, mais pas depuis
  les boutons Contact de la navbar et du footer (l'état vit dans `Version1Fluid`, pas dans `App`).
- **Liens profonds** (`/#contact`, `/#partners`…) : les sections sont chargées à la demande, donc l'ancre n'est pas
  atteinte au premier chargement.
- **Modales** : Échap, verrouillage du scroll et retour du focus sont gérés (`useModalBehavior`), mais le focus
  n'est pas piégé dans la modale (Tab peut en sortir). Les modales Partenaires et Modèles d'intervention ont leur
  propre gestion, plus ancienne.
- **Variantes d'intro V1, V2 et V4** : code conservé mais inaccessible (voir le commentaire dans `HeroOpeningCover.tsx`).
- **Poids du bundle** : le JS principal fait ~1,9 Mo (three.js et les effets de l'intro) ; à découper si les
  performances mobiles comptent.
- **Divers** : `bun.lock` n'est pas maintenu (utiliser npm) ; `metadata.json` et `.env.example` (`APP_URL`) viennent
  de l'outil de prototypage AI Studio et ne sont pas utilisés ; beaucoup d'imports d'icônes inutilisés dans
  `StrategicAxesSection.tsx`.

## Historique

Le dépôt a été initialisé à partir de l'état brut du prototype (premier commit), puis chaque correction de la
revue de passation fait l'objet d'un commit séparé (`git log`). Le plan suivi est dans `handoff-plan.md`.
