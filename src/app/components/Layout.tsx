import { Outlet, Link } from "react-router";
import { Brain } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
            <Brain className="size-8 text-neutral-900" />
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Reasoning Demos</h1>
              <p className="text-sm text-neutral-500">LLM Thinking Machines</p>
            </div>
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
