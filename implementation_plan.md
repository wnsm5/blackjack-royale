# Déploiement Railway (Serveur) + Vercel (Client)

## Architecture cible

```
Téléphone (5G)
    │
    ├─→ client.vercel.app  (React PWA)
    │         │ API calls
    └─→ server.railway.app (Express + PostgreSQL)
```

## Changements nécessaires

### 1. Prisma — SQLite → PostgreSQL
- `schema.prisma` : changer `provider = "sqlite"` → `provider = "postgresql"`
- Aucun changement de modèle (les types sont compatibles)

### 2. Serveur — Configuration Railway
- Ajouter `Procfile` : `web: node dist/index.js`
- Ajouter script `postinstall` dans `server/package.json` : `prisma generate && prisma migrate deploy`
- La `DATABASE_URL` PostgreSQL sera fournie par Railway

### 3. Client — Variable d'environnement API URL
- Ajouter `VITE_API_URL` dans `client/src/services/api.ts`
- `vercel.json` pour le routing SPA

### 4. Git — prérequis
- Le projet doit être poussé sur GitHub
- Railway et Vercel se connectent à GitHub
