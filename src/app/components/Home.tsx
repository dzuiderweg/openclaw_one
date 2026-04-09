import { Link } from "react-router";
import { FileText, Network } from "lucide-react";

const demos = [
  {
    id: "form-ocr",
    title: "Form OCR",
    description: "Using LLMs to recognize handwritten forms",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
    borderColor: "hover:border-blue-300",
  },
  {
    id: "design-reasoning-chain",
    title: "Design Reasoning Chain",
    description: "Multiple LLM versions performing different roles to reach better conclusions",
    icon: Network,
    color: "bg-purple-50 text-purple-600",
    borderColor: "hover:border-purple-300",
  },
];

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-neutral-900 mb-4">
          Explore LLM Reasoning Capabilities
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Experience how advanced language models think through complex problems. 
          Each demo showcases a different aspect of reasoning and problem-solving.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {demos.map((demo) => {
          const Icon = demo.icon;
          return (
            <Link
              key={demo.id}
              to={`/${demo.id}`}
              className={`block p-8 bg-white border-2 border-neutral-200 rounded-lg transition-all hover:shadow-lg ${demo.borderColor}`}
            >
              <div className={`inline-flex p-3 rounded-lg mb-4 ${demo.color}`}>
                <Icon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {demo.title}
              </h3>
              <p className="text-neutral-600">
                {demo.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
