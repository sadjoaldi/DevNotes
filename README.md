# 🐛 BugLog

> Ta mémoire technique personnelle — documente, archive et retrouve tes bugs et leurs solutions.

## Présentation

BugLog est une application web permettant aux développeurs de structurer leur expérience technique en documentant leurs bugs, leurs causes et leurs solutions. Une base de connaissance personnelle orientée debugging.

### Fonctionnalités

- Créer, modifier et supprimer des rapports de bugs
- Documenter la cause, la solution et le snippet de code associé
- Classer par catégorie, sévérité et statut (ouvert / résolu)
- Ajouter des tags et des technologies
- Enregistrer la durée de résolution
- Marquer les rapports en favoris
- Rechercher et filtrer les rapports
- Coloration syntaxique des snippets de code

## Stack technique

**Backend**

- Node.js + Express
- TypeScript
- Prisma 7 (ORM)
- SQLite (base de données locale)
- Morgan (logging)

**Frontend**

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Framer Motion
- Lucide React
- Axios
- React Router v6
- highlight.js

## Structure du projet

```
BugLog/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── types/
│   └── package.json
└── package.json
```

## Installation

### Prérequis

- Node.js >= 18
- pnpm >= 9

### Cloner le projet

```bash
git clone https://github.com/sadjoaldi/buglog.git
cd buglog
```

### Installer les dépendances

```bash
pnpm install:all
```

### Variables d'environnement

Copie le fichier `.env.sample` dans `backend/` et renseigne les valeurs :

```bash
cp backend/.env.sample backend/.env
```

```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

### Base de données

```bash
cd backend
pnpm dlx prisma migrate dev
pnpm dlx prisma generate
```

### Lancer le projet

Depuis la racine :

```bash
pnpm dev
```

Le backend tourne sur `http://localhost:3000` et le frontend sur `http://localhost:5173`.

## API

| Méthode | Route                              | Description                   |
| ------- | ---------------------------------- | ----------------------------- |
| GET     | `/api/v1/bug-reports`              | Liste tous les rapports       |
| GET     | `/api/v1/bug-reports/:id`          | Récupère un rapport           |
| POST    | `/api/v1/bug-reports`              | Crée un rapport               |
| PATCH   | `/api/v1/bug-reports/:id`          | Met à jour un rapport         |
| PATCH   | `/api/v1/bug-reports/:id/favorite` | Toggle favori                 |
| DELETE  | `/api/v1/bug-reports/:id`          | Supprime un rapport           |
| GET     | `/api/v1/tags`                     | Liste tous les tags           |
| GET     | `/api/v1/technologies`             | Liste toutes les technologies |

### Filtres disponibles sur GET `/api/v1/bug-reports`

| Paramètre    | Type    | Valeurs                                                                                                                                 |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `status`     | string  | `OPEN`, `RESOLVED`                                                                                                                      |
| `severity`   | string  | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`                                                                                                     |
| `category`   | string  | `FRONTEND`, `BACKEND`, `DATABASE`, `API`, `UI`, `PERFORMANCE`, `SECURITY`, `AUTHENTICATION`, `DEPLOYMENT`, `DEVOPS`, `TESTING`, `OTHER` |
| `isFavorite` | boolean | `true`, `false`                                                                                                                         |

## Roadmap

### v1 — Base fonctionnelle ✅

- CRUD complet
- Filtres et recherche
- UI dark mode responsive
- Animations et transitions

### v2 — Authentication

- Better Auth
- Comptes utilisateurs
- Données privées par utilisateur

### v3 — Dashboard & Stats

- Statistiques par catégorie et sévérité
- Sidebar droite contextuelle
- Temps moyen de résolution
- Top technologies affectées

## Licence

MIT
