export type FieldType = "text" | "date" | "number" | "checkbox" | "email" | "phone";

export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  description: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: number;
  imageDataUrl?: string;
}

export interface ExtractionResult {
  fieldName: string;
  value: string;
  confidence: number;
}

export interface ExtractionState {
  template: FormTemplate;
  results: ExtractionResult[];
  imageDataUrl: string;
}

// Ollama API types

export interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  images?: string[];
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream: false;
  format?: "json";
  options?: { temperature?: number };
}

export interface OllamaChatResponse {
  message: { role: string; content: string };
  done: boolean;
}

// Model configuration

export interface ModelPreset {
  id: string;
  name: string;
  model: string;
  description: string;
  supportsVision: boolean;
}

// Processing pipeline

export interface PipelineContext {
  model: string;
  temperature: number;
  [key: string]: unknown;
}

export interface ProcessingStep<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  execute: (input: TInput, context: PipelineContext) => Promise<TOutput>;
}
