import type { FormField, OllamaChatMessage } from "./form-ocr-types";

export function buildFieldDetectionMessages(imageBase64: string): OllamaChatMessage[] {
  return [
    {
      role: "system",
      content: [
        "You are a form analysis assistant. Examine the provided form image and identify every fillable field.",
        "Return ONLY valid JSON with no additional text.",
        'The JSON must be an object with a single key "fields" containing an array.',
        "Each element has:",
        '- "name" (string): the field label as written on the form',
        '- "type" (one of: text, date, number, checkbox, email, phone): the expected data type',
        '- "description" (string): brief description of the field\'s location and purpose on the form',
        "Be thorough -- identify every field including small checkboxes and signature lines.",
      ].join(" "),
    },
    {
      role: "user",
      content: "Analyze this form image and identify all fillable fields.",
      images: [imageBase64],
    },
  ];
}

export function buildDataExtractionMessages(
  imageBase64: string,
  fields: FormField[]
): OllamaChatMessage[] {
  const fieldList = fields.map((f) => ({ name: f.name, type: f.type }));

  return [
    {
      role: "system",
      content: [
        "You are a data extraction assistant. You will be given an image of a filled-in form and a list of expected fields.",
        "Extract the value written in each field.",
        "Return ONLY valid JSON with no additional text.",
        'The JSON must be an object with a single key "results" containing an array.',
        "Each element has:",
        '- "fieldName" (string): matching the provided field name exactly',
        '- "value" (string): the extracted value -- use empty string if unreadable. For checkboxes, use "checked" or "unchecked"',
        '- "confidence" (integer 0-100): your confidence in the extraction accuracy',
        "Be conservative with confidence scores -- only use 90+ when the text is clearly legible.",
      ].join(" "),
    },
    {
      role: "user",
      content: `Extract values for these fields: ${JSON.stringify(fieldList)}`,
      images: [imageBase64],
    },
  ];
}
