# Trading IA — Dashboard (Frontend)

**Interface web** (Next.js) pour piloter et surveiller le moteur Trading IA.

Elle permet notamment de :

- suivre les performances (portefeuille, PnL, taux de réussite) ;
- voir les trades, signaux, analyses IA et actualités ;
- démarrer / arrêter le moteur ;
- connecter les clés exchange utilisateur (validation côté backend).

**Important :** ce projet **dépend du backend** dans `../trading_ia`. Sans API qui tourne, beaucoup d’écrans sembleront vides ou en erreur.

---

## Sommaire

1. [C’est quoi ce dossier ?](#cest-quoi-ce-dossier-)
2. [Pour François (débutant)](#pour-françois-débutant)
3. [Glossaire rapide](#glossaire-rapide)
4. [Stack technique](#stack-technique)
5. [Structure du projet](#structure-du-projet)
6. [Installation locale](#installation-locale)
7. [Lancer en développement](#lancer-en-développement)
8. [Build production](#build-production)
9. [Pages principales](#pages-principales)
10. [Intégration API](#intégration-api)
11. [UX et design](#ux-et-design)
12. [Dépannage](#dépannage)
13. [Déploiement](#déploiement)

---

## C’est quoi ce dossier ?

C’est la **partie visible dans le navigateur** : boutons, graphiques, menus.  
Elle **parle au backend** via des appels HTTP (fetch) vers l’URL définie dans `.env.local`.

**En pratique :** lance d’abord l’API (`trading_ia`), puis ce dashboard.

---

## Pour François (débutant)

Si tu débutes sur le web ou Next.js, commence ici.

### Ordre recommandé le premier jour

1. **Installer Node.js LTS** (vérifie avec `node -v` et `npm -v`).
2. Dans un terminal : `cd dashboard` puis `npm install` (télécharge les dépendances du projet).
3. Copier `.env.local.example` vers `.env.local`.
4. Dans `.env.local`, mettre `NEXT_PUBLIC_API_URL=http://localhost:8000` **si** le backend tourne sur le port 8000.
5. Si le backend utilise une vraie `API_SECRET_KEY` (pas `change-me-in-production`), ajoute **`NEXT_PUBLIC_TRADING_IA_API_KEY`** avec la **même** valeur pour piloter le moteur / les clés exchange depuis l’UI. *Attention : cette variable est exposée au navigateur.*
6. **Démarrer le backend** (voir [../trading_ia/README.md](../trading_ia/README.md)).
7. Lancer `npm run dev`.
8. Ouvrir **http://localhost:3000** — tu dois voir l’application.

### Vocabulaire pour toi

| Terme | Signification simple |
|--------|----------------------|
| **Frontend** | Ce que l’utilisateur voit dans le navigateur (ce dossier). |
| **Next.js** | Framework React pour faire des sites avec routing et SSR/SSG selon les pages. |
| **React** | Bibliothèque pour construire l’UI avec des composants réutilisables. |
| **TypeScript** | JavaScript avec des types pour éviter certaines erreurs à l’écriture. |
| **Tailwind** | Classes CSS utilitaires pour styliser rapidement. |
| **`npm install`** | Installe les paquets listés dans `package.json`. |
| **`npm run dev`** | Lance le serveur de développement (rechargement rapide). |
| **`NEXT_PUBLIC_...`** | Variable d’environnement **visible côté navigateur** (évite d’y mettre des secrets sauf compromis connu comme `NEXT_PUBLIC_TRADING_IA_API_KEY` en dev). |

### Où regarder dans le code en premier

- `src/lib/utils.ts` — fonction `apiFetch` et base URL de l’API.
- `src/app/dashboard/page.tsx` — page d’accueil du cockpit.
- `src/components/` — blocs réutilisables (cartes, graphiques, navigation).

### Pièges fréquents

- **Page blanche ou données absentes** → Backend arrêté ou mauvaise `NEXT_PUBLIC_API_URL`.
- **Erreur CORS dans la console** → Côté backend, vérifier `CORS_ORIGINS` (doit inclure l’origine du dashboard, ex. `http://localhost:3000`).
- **Clés exchange refusées** → Vérifier les permissions sur l’exchange (pas de retrait) et les messages d’erreur de l’API.

---

## Glossaire rapide

- **PnL** : profit et perte (performance).
- **Cockpit** : vue d’ensemble type tableau de bord.

---

## Stack technique

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Recharts
- lucide-react

---

## Structure du projet

```text
dashboard/
├── src/app/
│   ├── login/
│   └── dashboard/
│       ├── page.tsx        # Vue d’ensemble cockpit
│       ├── trades/
│       ├── signals/
│       ├── analyses/
│       ├── news/
│       ├── engine/
│       └── settings/
├── src/components/
│   ├── top-nav.tsx
│   ├── cards.tsx
│   └── portfolio-chart.tsx
├── src/lib/
│   ├── hooks.ts
│   └── utils.ts           # apiFetch + base API
├── .env.local.example
└── package.json
```

---

## Installation locale

```bash
cd dashboard
npm install
cp .env.local.example .env.local
```

Dans `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Adapte l’URL si ton API n’est pas sur le port 8000.

---

## Lancer en développement

```bash
cd dashboard
npm run dev
```

Application : [http://localhost:3000](http://localhost:3000)

---

## Build production

```bash
npm run build
npm run start
```

---

## Pages principales

| Chemin | Rôle |
|--------|------|
| `/login` | Connexion |
| `/dashboard` | Vue d’ensemble |
| `/dashboard/trades` | Trades |
| `/dashboard/signals` | Signaux |
| `/dashboard/analyses` | Analyses IA |
| `/dashboard/news` | Actualités |
| `/dashboard/engine` | Contrôle moteur |
| `/dashboard/settings` | Réglages / clés |

---

## Intégration API

Le frontend appelle le backend via **`apiFetch`** :

- URL de base : `NEXT_PUBLIC_API_URL`
- Clé optionnelle : si `NEXT_PUBLIC_TRADING_IA_API_KEY` est défini, le header **`X-API-Key`** est envoyé (requis par l’API pour moteur / exchange lorsque `API_SECRET_KEY` est configuré).
- Implémentation : `src/lib/utils.ts`

Un bandeau d’erreur s’affiche en haut des pages du dashboard si `/api/health` échoue (`src/components/backend-status.tsx`).

Exemples d’endpoints utilisés :

- `GET /api/dashboard`
- `GET /api/portfolio/history`
- `GET /api/trades`
- `GET /api/signals`
- `GET /api/analyses`
- `GET /api/news`
- `GET /api/engine/status`
- `POST /api/engine/control`
- `GET /api/config`
- `POST /api/exchange/keys`
- `GET /api/exchange/keys`
- `DELETE /api/exchange/keys`

Détail des routes : [../trading_ia/README.md](../trading_ia/README.md).

---

## UX et design

Interface type **cockpit** pleine largeur : lisibilité (tailles, contrastes, espacements), navigation en tête renforcée, cartes métriques plus grandes, graphique portefeuille plus visible.

---

## Dépannage

| Symptôme | Piste |
|----------|--------|
| Rien ne s’affiche ou chargement infini | Vérifier que l’API tourne sur `NEXT_PUBLIC_API_URL`. |
| Erreur CORS | Ajuster `CORS_ORIGINS` côté backend. |
| **401** sur moteur / clés exchange | Définir `NEXT_PUBLIC_TRADING_IA_API_KEY` = `API_SECRET_KEY` côté API, ou remettre `API_SECRET_KEY=change-me-in-production` en local. |
| Échec clés exchange | Permissions API exchange (pas de withdraw). |

---

## Déploiement

Le dashboard peut être déployé sur **Vercel**.

Variable Vercel :

- `NEXT_PUBLIC_API_URL=https://votre-api.example.com`
- `NEXT_PUBLIC_TRADING_IA_API_KEY` si l’API exige `X-API-Key` (même valeur que `API_SECRET_KEY` — réfléchis au risque d’exposition).

**Docker :** un `Dockerfile` (build **standalone**) est fourni ; il est utilisé par `docker compose` côté `trading_ia` avec le profil `ui` (voir [../trading_ia/README.md](../trading_ia/README.md)).

---

*Prérequis : API Trading IA — voir [../trading_ia/README.md](../trading_ia/README.md).*
