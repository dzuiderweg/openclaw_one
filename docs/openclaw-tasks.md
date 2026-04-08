# OpenClaw Task Guide

Use this file to brief OpenClaw on tasks. Keep each task small and specific.

## Template

- **Goal:** One sentence outcome
- **Files to touch:** e.g., `src/app/content/devProcess.ts`
- **Acceptance criteria:** bullet list
- **Context:** short background or links

## Examples

1) Update Principles copy
- Goal: Make “Bias to automation” emphasize lint/format hooks.
- Files: `src/app/content/devProcess.ts`
- Acceptance: Text updated; no other fields removed; build passes.

2) Add error-state to change request form
- Goal: Show inline error when email missing.
- Files: `src/app/components/DevProcessHub.tsx`
- Acceptance: Form prevents submit without email; message visible near field; still clears on success.

3) Add sample task for LLM demo
- Goal: New demo card on home + route showing an LLM chain example.
- Files: `src/app/components/Home.tsx`, `src/app/routes.tsx`, new component under `src/app/components/demos/`.
- Acceptance: Card navigates correctly; page renders copy and a fake output panel.

## Notes for agents
- Keep imports sorted and use existing Tailwind tokens.
- Avoid adding new dependencies without a note in PR/commit message.
- Run `npm run build` before delivery.
