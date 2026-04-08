import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronRight, Loader2 } from "lucide-react";

interface ReasoningStep {
  label: string;
  content: string;
}

interface ReasoningDemoProps {
  title: string;
  description: string;
  problem: string;
  steps: ReasoningStep[];
  conclusion: string;
}

export function ReasoningDemo({ title, description, problem, steps, conclusion }: ReasoningDemoProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(-1);
    
    // Show problem first
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Then show each step
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    // Finally show conclusion
    setCurrentStep(steps.length);
    setIsRunning(false);
  };

  const reset = () => {
    setCurrentStep(-1);
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-neutral-900 mb-3">{title}</h2>
        <p className="text-lg text-neutral-600">{description}</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
          Problem
        </h3>
        <p className="text-lg text-neutral-900 leading-relaxed">{problem}</p>
      </div>

      <div className="flex gap-3 mb-8">
        <Button
          onClick={runDemo}
          disabled={isRunning}
          className="bg-neutral-900 hover:bg-neutral-800"
        >
          {isRunning ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Thinking...
            </>
          ) : (
            <>
              Run Reasoning Demo
              <ChevronRight className="size-4 ml-2" />
            </>
          )}
        </Button>
        {currentStep >= 0 && !isRunning && (
          <Button onClick={reset} variant="outline">
            Reset
          </Button>
        )}
      </div>

      {currentStep >= 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
            Reasoning Steps
          </h3>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-white border rounded-lg p-6 transition-all ${
                index <= currentStep
                  ? "border-neutral-300 opacity-100"
                  : "border-neutral-200 opacity-40"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 mb-2">{step.label}</h4>
                  <p className="text-neutral-700 leading-relaxed">{step.content}</p>
                </div>
              </div>
            </div>
          ))}

          {currentStep >= steps.length && (
            <div className="bg-neutral-900 text-white border border-neutral-900 rounded-lg p-6 mt-6">
              <h4 className="font-semibold mb-2">Conclusion</h4>
              <p className="leading-relaxed">{conclusion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
