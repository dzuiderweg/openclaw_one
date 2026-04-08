import { Link } from "react-router";

export function OpenClawIntro() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">OpenClaw</p>
        <h1 className="text-4xl font-semibold text-neutral-900">Connect your app to the claw.</h1>
        <p className="text-lg text-neutral-600 max-w-2xl">
          Drop in your client initialization once you have credentials. The hook below shows where to start, plus a
          couple of ideas for attaching the agent to UI events.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Initialization steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-neutral-700">
            <li>Create an API key in OpenClaw.</li>
            <li>Add it to `.env` as `VITE_OPENCLAW_KEY`.</li>
            <li>Open `src/app/openclaw.ts` and replace the stub with the real client.</li>
            <li>Call any session setup and event listeners you need there.</li>
          </ol>
        </section>

        <section className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Starter pattern</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700">
            <li>Expose a singleton `getClient()` from `openclaw.ts` so components can reuse it.</li>
            <li>Add telemetry/logging in the same module to keep it centralized.</li>
            <li>Gate UI affordances until `client.ready === true` to avoid race conditions.</li>
          </ul>
        </section>
      </div>

      <section className="p-6 rounded-xl border border-neutral-200 bg-white shadow-sm space-y-3">
        <h2 className="text-xl font-semibold">Example integration hook</h2>
        <pre className="overflow-x-auto text-sm bg-neutral-950 text-neutral-100 rounded-lg p-4">
{`// src/app/openclaw.ts
import OpenClaw from 'openclaw-client';

let client: OpenClaw | null = null;

export async function getClient() {
  if (client) return client;
  client = new OpenClaw({ apiKey: import.meta.env.VITE_OPENCLAW_KEY });
  await client.connect();
  return client;
}`}
        </pre>
        <p className="text-neutral-600 text-sm">
          Use the real API surface from your SDK; this is just a placement example.
        </p>
      </section>

      <footer className="flex gap-3 text-sm">
        <Link to="/" className="text-neutral-600 hover:text-neutral-900">← Back to demos</Link>
      </footer>
    </div>
  );
}
