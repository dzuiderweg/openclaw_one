export const principles = [
  {
    title: "Tight feedback loops",
    description: "Ship small, review fast, and keep changes observable with logs and screenshots." ,
  },
  {
    title: "Explain the why",
    description: "Every change links to a user outcome or a hypothesis—no orphan tasks." ,
  },
  {
    title: "Bias to automation",
    description: "Codify repeatable steps in scripts, templates, and checklists so humans stay on the interesting work." ,
  },
  {
    title: "Edge-case empathy",
    description: "Look for failure modes early—empty states, slow networks, bad inputs, and undo paths." ,
  },
];

export const checklists = [
  {
    title: "PR readiness",
    items: [
      "Includes clear before/after notes or screenshots",
      "Tests added or rationale for not needed",
      "Env vars documented",
      "Release notes / changelog updated if user-facing",
    ],
  },
  {
    title: "Reasoning demo additions",
    items: [
      "Scenario described in one paragraph",
      "Inputs/outputs typed and validated",
      "Failure path shown (network/error case)",
      "Observability hook (console, log, or toast)",
    ],
  },
];

export const guidelineBlocks = [
  {
    title: "Copy style",
    bullets: [
      "Lead with outcome, then steps",
      "Keep headlines 5–8 words; body 1–2 sentences",
      "Prefer verbs over nouns (\"Compare plans\" not \"Plan comparison\")",
    ],
  },
  {
    title: "UI consistency",
    bullets: [
      "Primary action on the right; secondary on the left",
      "Use neutral-900 text, neutral-600 body, neutral-200 borders",
      "One gradient or accent per page—rest stays minimal",
    ],
  },
  {
    title: "Agent handoff",
    bullets: [
      "Add task description in `docs/openclaw-tasks.md` with file targets",
      "Keep deterministic inputs (fixtures, seed data) for LLM reproducibility",
      "Log agent edits to a changefeed or PR for human review",
    ],
  },
];

export type ChangeRequest = {
  name: string;
  email: string;
  area: string;
  summary: string;
};
