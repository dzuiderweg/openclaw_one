import { useState } from "react";
import type {
  FormTemplate,
  ExtractionResult,
  PipelineContext,
} from "@/app/lib/form-ocr-types";
import { runPipeline, defaultDataExtractionPipeline } from "@/app/lib/form-ocr-pipeline";
import {
  getDefaultModel,
  DEFAULT_TEMPERATURE,
  DEFAULT_CONFIDENCE_THRESHOLD,
} from "@/app/lib/ollama-config";
import { ImageUpload } from "./ImageUpload";
import { ExtractionResultsTable } from "./ExtractionResultsTable";
import { ConfidenceReview } from "./ConfidenceReview";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Loader2, FileSearch, Info } from "lucide-react";

interface ExtractDataTabProps {
  templates: FormTemplate[];
  modelId?: string;
  confidenceThreshold?: number;
}

export function ExtractDataTab({
  templates,
  modelId,
  confidenceThreshold = DEFAULT_CONFIDENCE_THRESHOLD,
}: ExtractDataTabProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const [results, setResults] = useState<ExtractionResult[] | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null;

  async function extractData() {
    if (!image || !selectedTemplate) return;
    setIsExtracting(true);
    setError(null);
    setResults(null);
    setShowReview(false);

    try {
      const model = modelId ?? getDefaultModel().model;
      const context: PipelineContext = { model, temperature: DEFAULT_TEMPERATURE };
      const extractionResults = await runPipeline<ExtractionResult[]>(
        defaultDataExtractionPipeline,
        { file: image.file, fields: selectedTemplate.fields },
        context
      );
      setResults(extractionResults);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError("Cannot connect to Ollama. Ensure it is running on localhost:11434.");
      } else {
        setError(message);
      }
    } finally {
      setIsExtracting(false);
    }
  }

  if (templates.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No form templates defined</AlertTitle>
        <AlertDescription>
          Switch to the "Define Form" tab to create a form template first.
        </AlertDescription>
      </Alert>
    );
  }

  if (showReview && results && image) {
    return (
      <ConfidenceReview
        results={results}
        threshold={confidenceThreshold}
        imageDataUrl={image.dataUrl}
        onComplete={(updated) => {
          setResults(updated);
          setShowReview(false);
        }}
        onCancel={() => setShowReview(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Template & Upload Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Form Template</Label>
            <Select
              value={selectedTemplateId ?? ""}
              onValueChange={(value) => {
                setSelectedTemplateId(value);
                setResults(null);
                setError(null);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a form template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.fields.length} fields)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <>
              <ImageUpload
                onImageSelected={(file, dataUrl) => {
                  setImage({ file, dataUrl });
                  setResults(null);
                  setError(null);
                }}
                imagePreview={image?.dataUrl ?? null}
                onClear={() => {
                  setImage(null);
                  setResults(null);
                  setError(null);
                }}
                label="Upload a filled-in form"
              />

              {image && (
                <Button onClick={extractData} disabled={isExtracting} className="w-full">
                  {isExtracting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting data...
                    </>
                  ) : (
                    <>
                      <FileSearch className="mr-2 h-4 w-4" />
                      Extract Data
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Extraction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ExtractionResultsTable
              results={results}
              confidenceThreshold={confidenceThreshold}
              onStartReview={() => setShowReview(true)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
