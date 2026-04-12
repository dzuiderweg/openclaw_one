import { OLLAMA_BASE_URL, DEFAULT_TEMPERATURE, getDefaultModel } from "./ollama-config";
import type { OllamaChatMessage, OllamaChatRequest, OllamaChatResponse } from "./form-ocr-types";

export async function chatWithVision(
  messages: OllamaChatMessage[],
  model?: string,
  temperature?: number
): Promise<string> {
  const resolvedModel = model ?? getDefaultModel().model;

  const request: OllamaChatRequest = {
    model: resolvedModel,
    messages,
    stream: false,
    format: "json",
    options: { temperature: temperature ?? DEFAULT_TEMPERATURE },
  };

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    if (response.status === 404) {
      throw new Error(
        `Model '${resolvedModel}' not found. Run \`ollama pull ${resolvedModel}\` to install it.`
      );
    }
    throw new Error(`Ollama request failed (${response.status}): ${text}`);
  }

  const data: OllamaChatResponse = await response.json();
  return data.message.content;
}

export async function imageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Strip the data URI prefix -- Ollama expects raw base64
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export function parseJsonResponse<T>(raw: string): T {
  // Try direct parse
  try {
    return JSON.parse(raw) as T;
  } catch {
    // continue
  }

  // Try extracting from markdown code fences
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]) as T;
    } catch {
      // continue
    }
  }

  // Try finding first { or [ and last } or ]
  const startBrace = raw.indexOf("{");
  const startBracket = raw.indexOf("[");
  let start = -1;
  let end = -1;

  if (startBrace >= 0 && (startBracket < 0 || startBrace < startBracket)) {
    start = startBrace;
    end = raw.lastIndexOf("}");
  } else if (startBracket >= 0) {
    start = startBracket;
    end = raw.lastIndexOf("]");
  }

  if (start >= 0 && end > start) {
    try {
      return JSON.parse(raw.slice(start, end + 1)) as T;
    } catch {
      // continue
    }
  }

  throw new Error(`Failed to parse JSON from LLM response: ${raw.slice(0, 200)}`);
}
