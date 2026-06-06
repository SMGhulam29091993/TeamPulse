<div align="center">

# ⚡ TeamPulse

### AI-powered team productivity platform that turns inbox chaos into clarity.

*Smart digests · Action item extraction · Team knowledge search*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/)

</div>

---

## The Problem

Knowledge workers spend **28% of their workweek** managing email and **23% searching for information** that already exists somewhere in their organisation. Every morning starts with the same ritual — sifting through 80 unread emails, hunting through Slack threads for a decision made last Tuesday, re-reading a meeting transcript because someone forgot to write up the action items.

**TeamPulse fixes this.**

---

## What It Does

| Pillar | What it does |
|---|---|
| **Smart Inbox AI** | Generates a prioritised morning digest from your emails. Surfaces what needs your attention. Drafts context-aware replies. |
| **Meeting Clarity** | Transcribes meetings in real time, extracts who owns which action item, and pushes tasks to Jira or Asana automatically. |
| **Team Knowledge Graph** | Semantic search across your organisation's Slack, Drive, and docs. Answers "has anyone solved this before?" instantly. |

---

## Architecture

TeamPulse is built as a **production-grade TypeScript monorepo** with a clean separation of concerns across every layer.

```
TeamPulse/
├── apps/
│   ├── api/          — Node.js + Express backend (OOP, SOLID, Repository pattern)
│   └── web/          — Next.js 15 frontend (in progress)
└── packages/
    ├── ui/           — Shared component library
    ├── eslint-config/
    ├── typescript-config/
    └── config-prettier/
```

### Backend Architecture (`apps/api`)

The backend is built with strict **OOP + SOLID principles** and **LLD patterns** throughout — not a typical Express tutorial layout.

```
src/
├── modules/          ← Feature-based, not layer-based
│   ├── auth/         — controller · service · repository · routes · types
│   ├── user/         — controller · service · repository · routes · types
│   └── digest/       — controller · service · repository · routes · types
├── shared/
│   ├── interfaces/   — IRepository · IService · IController
│   ├── middleware/   — error · auth · validate
│   ├── errors/       — AppError · NotFoundError · ValidationError
│   └── utils/        — response shaping
├── database/
│   └── prisma.client.ts   ← Singleton pattern, connection-safe hot-reload
└── types/
    └── express.d.ts       ← req.user augmentation
```

**Dependency flow — strictly enforced:**
```
Controller → IService → IRepository → PrismaClient
```

Services receive repository interfaces via constructor injection (Dependency Inversion). Services never touch Prisma directly. Repositories contain zero business logic.

### Key Technical Decisions

**Single Node.js backend** — no Python microservice. LangChain JS handles all AI orchestration at near-parity with the Python library for the chains needed (summarisation, extraction, embeddings).

**SSE over Socket.io** — digest delivery uses Server-Sent Events. A one-way stream from server to browser is all that's needed. No Redis adapter, no connection management overhead.

**Explicit join tables** — many-to-many relations (User ↔ Workspace) use explicit Prisma models so role data can be stored on the relationship.

**PrismaClient Singleton with globalThis cache** — prevents connection pool exhaustion on `tsx` hot-reload in development. Production skips the global cache for clean process restarts.

---

## Tech Stack

### Backend
- **Runtime:** Node.js 20 + TypeScript 5
- **Framework:** Express.js
- **ORM:** Prisma 7 with `@prisma/adapter-pg` (driver adapter)
- **Database:** PostgreSQL 15
- **AI:** LangChain JS, OpenAI / Anthropic
- **Vector DB:** Pinecone
- **Jobs:** BullMQ + Redis
- **Auth:** OAuth2 (Google, Microsoft, GitHub) + session management

### Frontend *(in progress)*
- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **State:** React Query
- **Real-time:** EventSource (SSE)

### Infrastructure
- **Monorepo:** Turborepo + pnpm workspaces
- **Containerisation:** Docker Compose (local dev)
- **CI:** Husky pre-commit hooks (lint + typecheck on every commit)

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/TeamPulse.git
cd TeamPulse

# Install dependencies
pnpm install

# Start the database
docker compose up -d

# Set up environment variables
cp apps/api/.env.example apps/api/.env.development
# Fill in your DATABASE_URL and OAuth credentials

# Run database migrations
cd apps/api && pnpm prisma migrate dev

# Start development servers
pnpm turbo dev --filter=api
```

The API will be available at `http://localhost:3000`.

---

## Development

```bash
# Run API in dev mode (hot-reload via tsx watch)
pnpm turbo dev --filter=api

# Type check
pnpm turbo typecheck

# Lint
pnpm turbo lint

# Build for production
pnpm turbo build
```

---

## Roadmap

- [x] Monorepo foundation (Turborepo + pnpm)
- [x] Express server with OOP/SOLID architecture
- [x] PostgreSQL + Prisma setup with connection pooling
- [ ] Prisma schema design (User, Workspace, Digest, ActionItem)
- [ ] Auth layer (OAuth2 + session management)
- [ ] MS Graph integration (email + calendar)
- [ ] BullMQ job queue infrastructure
- [ ] LangChain AI orchestration (summarisation + extraction)
- [ ] Digest pipeline (end to end)
- [ ] REST API surface + Zod validation
- [ ] SSE real-time delivery
- [ ] Semantic search (Pinecone)
- [ ] Next.js frontend

---

## Why This Stack

Every choice in this stack was made deliberately for a production MVP — not for a hackathon demo.

**TypeScript end-to-end** means type errors are caught at compile time, not in production. **Turborepo** means the frontend and backend share config, linting rules, and eventually types — with zero duplication. **Prisma** gives fully type-safe database access with a schema that acts as the single source of truth. **BullMQ** ensures the AI pipeline runs in the background without blocking HTTP responses.

This is not a side project architecture that gets rewritten before launch. It's built to scale from day one.

---

## Contributing

TeamPulse is in active development. If you're interested in contributing or following the build, watch the repo.

---

<div align="center">

Built with focus by [@SMGhulam29091993](https://github.com/SMGhulam29091993)

*Targeting Product Hunt launch — follow along*

</div>
