# AuraMatch

Telegram Mini App for deep Destiny Matrix calculation and compatibility analysis.

## Architecture

Three independent services orchestrated via Docker Compose:

- **`bot/`** — aiogram 3.x Telegram bot. Authorization + launching the Web App. No business logic.
- **`backend/`** — FastAPI service. Owns all matrix and compatibility calculations. Exposes a REST API.
- **`frontend/`** — React + Vite + Tailwind + Framer Motion. Telegram Mini App UI.

```
auramatch/
├── frontend/         React TWA (UI + design system)
│   └── src/
│       ├── design-system/   Theme tokens, icon registry
│       ├── assets/icons/    Custom SVG icons (no emoji)
│       ├── components/      Reusable UI primitives
│       ├── pages/           Screens
│       ├── hooks/           Telegram SDK + API hooks
│       └── services/        REST API client
├── backend/          FastAPI calculation core
│   └── app/
│       ├── api/routes/      REST endpoints
│       ├── core/            Calculation engine
│       └── schemas/         Pydantic models
├── bot/              aiogram 3.x — auth + WebApp launcher
└── docker-compose.yml
```

## Stages

MVP is built in stages. Current: **Stage 1 — visual skeleton + base API endpoint**.

Upcoming stages:
- Stage 2: Matrix calculation engine + result screen with interactive diagram.
- Stage 3: Compatibility module (two-matrix crossing visualization).
- Stage 4: aiogram bot + Telegram auth wiring + Docker compose.

## Local development

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload

# Bot (requires BOT_TOKEN)
cd bot && pip install -r requirements.txt && python -m app.main
```
