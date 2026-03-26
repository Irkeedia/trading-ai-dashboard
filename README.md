# Trading IA Dashboard

Frontend Next.js pour piloter et monitorer le moteur Trading IA.

Le dashboard permet de:
- suivre les performances (portfolio, PnL, win rate)
- voir les trades, signaux, analyses IA et news
- demarrer / arreter le moteur
- connecter les cles exchange utilisateur avec validation backend

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Recharts
- lucide-react

## Structure

```text
dashboard/
|- src/app/
|  |- login/
|  |- dashboard/
|     |- page.tsx           # Overview cockpit
|     |- trades/
|     |- signals/
|     |- analyses/
|     |- news/
|     |- engine/
|     |- settings/
|- src/components/
|  |- top-nav.tsx
|  |- cards.tsx
|  |- portfolio-chart.tsx
|- src/lib/
|  |- hooks.ts
|  |- utils.ts              # apiFetch + API base
|- .env.local.example
|- package.json
```

## Installation locale

```bash
cd dashboard
npm install
cp .env.local.example .env.local
```

Dans `.env.local`, renseigner:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Lancer en dev

```bash
cd dashboard
npm run dev
```

App dispo sur:
- `http://localhost:3000`

## Build production

```bash
npm run build
npm run start
```

## Pages principales

- `/login`
- `/dashboard` (overview)
- `/dashboard/trades`
- `/dashboard/signals`
- `/dashboard/analyses`
- `/dashboard/news`
- `/dashboard/engine`
- `/dashboard/settings`

## Integration API

Le frontend appelle l'API backend via `apiFetch`:
- base URL: `NEXT_PUBLIC_API_URL`
- helper: `src/lib/utils.ts`

Exemples d'endpoints utilises:
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

## UX et design

La version actuelle a une UI cockpit full-width:
- meilleure lisibilite (tailles, contrastes, espacements)
- navigation superieure renforcee
- cartes de metriques agrandies
- graphique portfolio plus grand

## Troubleshooting rapide

- Si rien ne s'affiche: verifier que l'API tourne sur `NEXT_PUBLIC_API_URL`
- Si erreur CORS: verifier `CORS_ORIGINS` cote backend
- Si les cles exchange echouent: verifier permissions API exchange (pas de withdraw)

## Deploiement

Le dashboard peut etre deploie sur Vercel.

Variables d'environnement Vercel:
- `NEXT_PUBLIC_API_URL=https://votre-api.example.com`
