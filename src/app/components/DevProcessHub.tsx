import React, { useState } from "react";
import { principles, checklists, guidelineBlocks, ChangeRequest } from "../content/devProcess";

const areas = ["Principles", "Checklists", "Guidelines", "Reasoning demos"];

export function DevProcessHub() {
  const [submitted, setSubmitted] = useState<ChangeRequest | null>(null);
  const [form, setForm] = useState<ChangeRequest>({ name: "", email: "", area: areas[0], summary: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(form);
    setForm({ name: "", email: "", area: areas[0], summary: "" });
    // In a real integration, post to your backend or OpenClaw task queue here.
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Dev Process Hub</p>
        <h1 className="text-4xl font-semibold text-neutral-900">Principles, checklists, and change requests</h1>
        <p className="text-lg text-neutral-600 max-w-3xl">
          A single place for humans and OpenClaw to collaborate on the development process. Edit the content files
          under `src/app/content/devProcess.ts`, or submit a change request below to hand work to the agent.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {principles.map((p) => (
          <div key={p.title} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Principle</p>
            <h3 className="text-xl font-semibold text-neutral-900 mt-2 mb-2">{p.title}</h3>
            <p className="text-neutral-700 leading-relaxed">{p.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {checklists.map((c) => (
          <div key={c.title} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Checklist</p>
            <h3 className="text-xl font-semibold text-neutral-900 mt-2 mb-4">{c.title}</h3>
            <ul className="space-y-2 text-neutral-700 list-disc list-inside">
              {c.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {guidelineBlocks.map((g) => (
          <div key={g.title} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Guidelines</p>
            <h3 className="text-lg font-semibold text-neutral-900 mt-2 mb-3">{g.title}</h3>
            <ul className="space-y-2 text-neutral-700 list-disc list-inside">
              {g.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
        <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Request a change</p>
            <h3 className="text-xl font-semibold text-neutral-900 mt-2">What should OpenClaw update?</h3>
            <p className="text-neutral-600 text-sm">This currently just saves locally—wire it to your backend when ready.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-neutral-700 space-y-1">
              Name
              <input
                required
                className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="text-sm text-neutral-700 space-y-1">
              Email
              <input
                type="email"
                required
                className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
          </div>

          <label className="text-sm text-neutral-700 space-y-1">
            Area
            <select
              className="w-full border border-neutral-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            >
              {areas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-neutral-700 space-y-1">
            Summary
            <textarea
              required
              rows={4}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition"
          >
            Submit request
          </button>
        </form>

        <div className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Handoff notes</p>
          <h3 className="text-xl font-semibold text-neutral-900 mt-2 mb-3">How to involve OpenClaw</h3>
          <ul className="space-y-2 text-neutral-700 list-disc list-inside">
            <li>Document the task in `docs/openclaw-tasks.md` with file targets and acceptance criteria.</li>
            <li>Prefer deterministic inputs (fixtures) the agent can use for previews/screenshots.</li>
            <li>Have OpenClaw open a PR or attach diffs for human review.</li>
          </ul>

          {submitted && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <p className="font-semibold">Captured request</p>
              <p>{submitted.name} ({submitted.email}) → {submitted.area}</p>
              <p className="mt-1">“{submitted.summary}”</p>
              <p className="mt-1 text-emerald-700">Replace this panel with a real backend call when ready.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
