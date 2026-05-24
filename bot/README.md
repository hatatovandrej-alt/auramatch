# AuraMatch bot

aiogram 3.x service. Stage 4 deliverable.

Responsibility: receive `/start`, render an inline button that opens the
Telegram Web App (`WEBAPP_URL`), and validate `initData` for any callbacks.
No business logic — calculations live in `backend/`.

Code lands when Stages 1–3 are merged so the WebApp it points to is fully
functional on first contact.
