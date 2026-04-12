import type { ModelPreset } from "./form-ocr-types";

export const OLLAMA_BASE_URL = "/api/ollama";

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "glm-ocr",
    name: "GLM OCR",
    model: "glm-ocr",
    description: "Specialized OCR vision model for handwriting recognition",
    supportsVision: true,
  },
  {
    id: "llava",
    name: "LLaVA",
    model: "llava",
    description: "General-purpose vision-language model",
    supportsVision: true,
  },
  {
    id: "llava-llama3",
    name: "LLaVA Llama 3",
    model: "llava-llama3",
    description: "LLaVA built on Llama 3 for improved reasoning",
    supportsVision: true,
  },
];

export const DEFAULT_MODEL_ID = "glm-ocr";

export const DEFAULT_TEMPERATURE = 0.1;

export const DEFAULT_CONFIDENCE_THRESHOLD = 70;

export function getModelPreset(id: string): ModelPreset | undefined {
  return MODEL_PRESETS.find((p) => p.id === id);
}

export function getDefaultModel(): ModelPreset {
  return MODEL_PRESETS.find((p) => p.id === DEFAULT_MODEL_ID) ?? MODEL_PRESETS[0];
}
