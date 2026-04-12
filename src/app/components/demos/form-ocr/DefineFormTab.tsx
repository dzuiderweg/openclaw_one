import { useState } from "react";
import type { FormField, FormTemplate, PipelineContext } from "@/app/lib/form-ocr-types";
import { runPipeline, defaultFieldDetectionPipeline } from "@/app/lib/form-ocr-pipeline";
import { getDefaultModel, DEFAULT_TEMPERATURE } from "@/app/lib/ollama-config";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Separator } from "@/app/components/ui/separator";
import { Loader2, Trash2, Plus, Save, ScanSearch } from "lucide-react";
import type { FieldType } from "@/app/lib/form-ocr-types";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "date", label: "Date" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

interface DefineFormTabProps {
  onSaveTemplate: (template: FormTemplate) => void;
  modelId?: string;
}

export function DefineFormTab({ onSaveTemplate, modelId }: DefineFormTabProps) {
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const [detectedFields, setDetectedFields] = useState<FormField[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  async function analyzeForm() {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    setIsSaved(false);

    try {
      const model = modelId ?? getDefaultModel().model;
      const context: PipelineContext = { model, temperature: DEFAULT_TEMPERATURE };
      const fields = await runPipeline<FormField[]>(
        defaultFieldDetectionPipeline,
        { file: image.file },
        context
      );
      setDetectedFields(fields);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError("Cannot connect to Ollama. Ensure it is running on localhost:11434.");
      } else {
        setError(message);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  function updateField(id: string, updates: Partial<FormField>) {
    setDetectedFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
    setIsSaved(false);
  }

  function removeField(id: string) {
    setDetectedFields((prev) => prev.filter((f) => f.id !== id));
    setIsSaved(false);
  }

  function addField() {
    setDetectedFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", type: "text" as FieldType, description: "" },
    ]);
    setIsSaved(false);
  }

  function saveTemplate() {
    if (!templateName.trim() || detectedFields.length === 0) return;

    const template: FormTemplate = {
      id: crypto.randomUUID(),
      name: templateName.trim(),
      fields: detectedFields,
      createdAt: Date.now(),
      imageDataUrl: image?.dataUrl,
    };
    onSaveTemplate(template);
    setIsSaved(true);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Form Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            onImageSelected={(file, dataUrl) => {
              setImage({ file, dataUrl });
              setDetectedFields([]);
              setError(null);
              setIsSaved(false);
            }}
            imagePreview={image?.dataUrl ?? null}
            onClear={() => {
              setImage(null);
              setDetectedFields([]);
              setError(null);
              setIsSaved(false);
            }}
            label="Upload a blank or sample form"
          />

          {image && (
            <Button onClick={analyzeForm} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing form...
                </>
              ) : (
                <>
                  <ScanSearch className="mr-2 h-4 w-4" />
                  Analyze Form
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {detectedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectedFields.map((field, index) => (
              <div key={field.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-neutral-500">Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          placeholder="Field name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-neutral-500">Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) =>
                            updateField(field.id, { type: value as FieldType })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-neutral-500">Description</Label>
                      <Input
                        value={field.description}
                        onChange={(e) => updateField(field.id, { description: e.target.value })}
                        placeholder="Field description"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-5 text-neutral-400 hover:text-red-500"
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addField} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>

            <Separator />

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => {
                    setTemplateName(e.target.value);
                    setIsSaved(false);
                  }}
                  placeholder="e.g., Patient Intake Form"
                />
              </div>
              <Button
                onClick={saveTemplate}
                disabled={!templateName.trim() || detectedFields.length === 0 || isSaved}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaved ? "Saved" : "Save Template"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
