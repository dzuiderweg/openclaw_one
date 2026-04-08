
# LLM Project Demo Website

Starter React + Vite shell to host OpenClaw demos. It already ships with routing, Tailwind v4 styles, and two placeholder demo pages (Form OCR and Design Reasoning Chain).

## Quick start

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Where to plug in OpenClaw

- Edit `src/app/openclaw.ts` to initialize the real OpenClaw client (API keys, connection, etc.).
- The stub is called once from `src/main.tsx`; replace the console log with your setup code.
- Add any environment variables as `VITE_*` keys in a `.env` file (ignored by git).

## Project layout

- `src/app/routes.tsx` defines the demo routes and page components.
- `src/app/components/DevProcessHub.tsx` renders principles, checklists, and the change-request form.
- `src/app/content/devProcess.ts` stores the editable copy for the hub.
- `src/styles/` contains Tailwind v4 and theme tokens.
- `guidelines/Guidelines.md` is a template for AI/system rules—keep or replace as needed.
- `docs/openclaw-tasks.md` describes how to brief tasks for the agent.

## Attributions

See `ATTRIBUTIONS.md` for upstream licenses and credits.
