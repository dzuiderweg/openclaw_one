import { useState, useMemo } from "react";
import type { ExtractionResult } from "@/app/lib/form-ocr-types";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Progress } from "@/app/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface ConfidenceReviewProps {
  results: ExtractionResult[];
  threshold: number;
  imageDataUrl: string;
  onComplete: (updatedResults: ExtractionResult[]) => void;
  onCancel: () => void;
}

export function ConfidenceReview({
  results,
  threshold,
  imageDataUrl,
  onComplete,
  onCancel,
}: ConfidenceReviewProps) {
  const flaggedIndices = useMemo(
    () => results.map((r, i) => (r.confidence < threshold ? i : -1)).filter((i) => i >= 0),
    [results, threshold]
  );

  const [currentFlaggedIdx, setCurrentFlaggedIdx] = useState(0);
  const [editedResults, setEditedResults] = useState<ExtractionResult[]>([...results]);
  const [correctedValue, setCorrectedValue] = useState(
    results[flaggedIndices[0]]?.value ?? ""
  );

  const currentResultIdx = flaggedIndices[currentFlaggedIdx];
  const currentResult = editedResults[currentResultIdx];
  const isLast = currentFlaggedIdx === flaggedIndices.length - 1;
  const progress = ((currentFlaggedIdx + 1) / flaggedIndices.length) * 100;

  function acceptAndAdvance() {
    const updated = [...editedResults];
    updated[currentResultIdx] = {
      ...currentResult,
      value: correctedValue,
      confidence: correctedValue !== currentResult.value ? 100 : currentResult.confidence,
    };
    setEditedResults(updated);

    if (isLast) {
      onComplete(updated);
    } else {
      const nextIdx = currentFlaggedIdx + 1;
      setCurrentFlaggedIdx(nextIdx);
      setCorrectedValue(updated[flaggedIndices[nextIdx]]?.value ?? "");
    }
  }

  function goBack() {
    if (currentFlaggedIdx <= 0) return;
    const prevIdx = currentFlaggedIdx - 1;
    setCurrentFlaggedIdx(prevIdx);
    setCorrectedValue(editedResults[flaggedIndices[prevIdx]]?.value ?? "");
  }

  if (flaggedIndices.length === 0) {
    onComplete(results);
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Reviewing field {currentFlaggedIdx + 1} of {flaggedIndices.length}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={imageDataUrl}
              alt="Uploaded form"
              className="w-full max-h-96 object-contain rounded border border-neutral-200"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-neutral-500">Field Name</Label>
              <p className="text-lg font-semibold">{currentResult.fieldName}</p>
            </div>

            <div>
              <Label className="text-sm text-neutral-500">Confidence</Label>
              <div className="mt-1">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  {currentResult.confidence}%
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm text-neutral-500">LLM Extracted Value</Label>
              <div className="mt-1 rounded bg-neutral-100 px-3 py-2 font-mono text-sm">
                {currentResult.value || <span className="text-neutral-400 italic">empty</span>}
              </div>
            </div>

            <div>
              <Label htmlFor="corrected-value">Corrected Value</Label>
              <Input
                id="corrected-value"
                value={correctedValue}
                onChange={(e) => setCorrectedValue(e.target.value)}
                className="mt-1"
                placeholder="Enter corrected value..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={currentFlaggedIdx === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button onClick={acceptAndAdvance} className="flex-1">
                {isLast ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Finish Review
                  </>
                ) : (
                  <>
                    Accept & Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
