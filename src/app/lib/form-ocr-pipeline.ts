import type {
  FormField,
  ExtractionResult,
  PipelineContext,
  ProcessingStep,
} from "./form-ocr-types";
import { chatWithVision, imageFileToBase64, parseJsonResponse } from "./ollama";
import { buildFieldDetectionMessages, buildDataExtractionMessages } from "./form-ocr-prompts";

// --- Pipeline runner ---

export async function runPipeline<T>(
  steps: ProcessingStep[],
  initialInput: unknown,
  context: PipelineContext
): Promise<T> {
  let current = initialInput;
  for (const step of steps) {
    current = await step.execute(current, context);
  }
  return current as T;
}

// --- Built-in steps for field detection ---

interface FieldDetectionInput {
  file: File;
}

const convertImageStep: ProcessingStep<FieldDetectionInput, { imageBase64: string; file: File }> = {
  name: "convertImage",
  description: "Convert uploaded image file to base64",
  execute: async (input) => {
    const imageBase64 = await imageFileToBase64(input.file);
    return { imageBase64, file: input.file };
  },
};

const detectFieldsLlmStep: ProcessingStep<{ imageBase64: string }, { raw: string }> = {
  name: "detectFieldsLlm",
  description: "Send image to LLM for field detection",
  execute: async (input, context) => {
    const messages = buildFieldDetectionMessages(input.imageBase64);
    const raw = await chatWithVision(messages, context.model, context.temperature);
    return { raw };
  },
};

const parseFieldsStep: ProcessingStep<{ raw: string }, FormField[]> = {
  name: "parseFields",
  description: "Parse LLM response into FormField array",
  execute: async (input) => {
    const parsed = parseJsonResponse<{ fields: Array<{ name: string; type: string; description: string }> }>(input.raw);
    return parsed.fields.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: (f.type as FormField["type"]) || "text",
      description: f.description || "",
    }));
  },
};

// --- Built-in steps for data extraction ---

interface ExtractionInput {
  file: File;
  fields: FormField[];
}

const convertImageForExtractionStep: ProcessingStep<ExtractionInput, { imageBase64: string; fields: FormField[] }> = {
  name: "convertImage",
  description: "Convert uploaded image file to base64 for extraction",
  execute: async (input) => {
    const imageBase64 = await imageFileToBase64(input.file);
    return { imageBase64, fields: input.fields };
  },
};

const extractDataLlmStep: ProcessingStep<{ imageBase64: string; fields: FormField[] }, { raw: string }> = {
  name: "extractDataLlm",
  description: "Send image and field template to LLM for data extraction",
  execute: async (input, context) => {
    const messages = buildDataExtractionMessages(input.imageBase64, input.fields);
    const raw = await chatWithVision(messages, context.model, context.temperature);
    return { raw };
  },
};

const parseExtractionStep: ProcessingStep<{ raw: string }, ExtractionResult[]> = {
  name: "parseExtraction",
  description: "Parse LLM response into ExtractionResult array",
  execute: async (input) => {
    const parsed = parseJsonResponse<{ results: ExtractionResult[] }>(input.raw);
    return parsed.results.map((r) => ({
      fieldName: r.fieldName,
      value: r.value ?? "",
      confidence: Math.max(0, Math.min(100, Math.round(r.confidence ?? 0))),
    }));
  },
};

// --- Default pipelines ---

export const defaultFieldDetectionPipeline: ProcessingStep[] = [
  convertImageStep as ProcessingStep,
  detectFieldsLlmStep as ProcessingStep,
  parseFieldsStep as ProcessingStep,
];

export const defaultDataExtractionPipeline: ProcessingStep[] = [
  convertImageForExtractionStep as ProcessingStep,
  extractDataLlmStep as ProcessingStep,
  parseExtractionStep as ProcessingStep,
];
