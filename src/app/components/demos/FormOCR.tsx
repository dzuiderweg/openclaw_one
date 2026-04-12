import { useState } from "react";
import type { FormTemplate } from "@/app/lib/form-ocr-types";
import { MODEL_PRESETS, DEFAULT_CONFIDENCE_THRESHOLD } from "@/app/lib/ollama-config";
import { DefineFormTab } from "./form-ocr/DefineFormTab";
import { ExtractDataTab } from "./form-ocr/ExtractDataTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";

export function FormOCR() {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedModelId, setSelectedModelId] = useState(MODEL_PRESETS[0].id);
  const [confidenceThreshold, setConfidenceThreshold] = useState(DEFAULT_CONFIDENCE_THRESHOLD);

  function addTemplate(template: FormTemplate) {
    setTemplates((prev) => [...prev, template]);
  }

  const selectedPreset = MODEL_PRESETS.find((p) => p.id === selectedModelId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-4">
          Handwritten Form Recognition & Data Extraction
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Extract structured data from handwritten forms using LLM-powered recognition.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-xs text-neutral-500">Model</Label>
          <Select value={selectedModelId} onValueChange={setSelectedModelId}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODEL_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPreset && (
            <p className="text-xs text-neutral-400 mt-1">{selectedPreset.description}</p>
          )}
        </div>
        <div className="w-32">
          <Label className="text-xs text-neutral-500">Confidence Threshold</Label>
          <div className="flex items-center gap-1 mt-1">
            <Input
              type="number"
              min={0}
              max={100}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="text-center"
            />
            <span className="text-sm text-neutral-500">%</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="define">
        <TabsList className="w-full">
          <TabsTrigger value="define" className="flex-1">
            Define Form
          </TabsTrigger>
          <TabsTrigger value="extract" className="flex-1">
            Extract Data
          </TabsTrigger>
        </TabsList>
        <TabsContent value="define" className="mt-6">
          <DefineFormTab
            onSaveTemplate={addTemplate}
            modelId={selectedModelId}
          />
        </TabsContent>
        <TabsContent value="extract" className="mt-6">
          <ExtractDataTab
            templates={templates}
            modelId={selectedModelId}
            confidenceThreshold={confidenceThreshold}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
