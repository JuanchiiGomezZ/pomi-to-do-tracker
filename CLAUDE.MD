# Pomi To-Do Tracker

Monorepo con backend NestJS, frontend Next.js y mobile Expo/React Native.

## Tech Stack

**Backend:** NestJS 11 + PostgreSQL/Prisma + JWT Auth + Redis + AWS S3
**Frontend:** Next.js 16 + React 19 + Tailwind + Zustand + React Query
**Mobile:** Expo 54 + React Native + Unistyles + TanStack Query

## Monorepo Structure

```
├── backend/          # API NestJS (puerto 3000)
├── frontend/         # App Next.js (puerto 4000)
├── mobile/           # App Expo (puerto 8082)
├── .claude/          # Documentación y reglas
└── docs/             # Documentación adicional
```

## Documentation

**`.claude/rules/`** contiene toda la documentación detallada:

| Archivo/Carpeta | Descripción |
|-----------------|-------------|
| `general.md` | Comandos, git workflow, env vars |
| `testing.md` | Estrategia de testing |
| `architecture.md` | Arquitectura completa del sistema |
| `backend/` | Patrones backend (auth, API, DB, cache, email, storage) |
| `frontend/` | Patrones frontend (componentes, forms, i18n, state, API) |
| `mobile/` | Patrones mobile (arquitectura, componentes, state, i18n, forms) |
| `sop/` | Procedimientos paso a paso |
| `reference/` | Decisiones técnicas documentadas |

## Quick Links

- **API Backend:** http://localhost:3000/api/docs
- **Frontend Dev:** http://localhost:4000
- **Mobile Dev:** `npm run start` en `/mobile`

Ver `.claude/rules/` para patrones, ejemplos y mejores prácticas.
