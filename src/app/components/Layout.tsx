import { Outlet, Link, useLocation } from "react-router";
import { Brain } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
            <Brain className="size-8 text-neutral-900" />
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Reasoning Demos</h1>
              <p className="text-sm text-neutral-500">LLM Thinking Machines</p>
            </div>
          </Link>
          {!isHome && (
            <Link 
              to="/" 
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ← Back to demos
            </Link>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
