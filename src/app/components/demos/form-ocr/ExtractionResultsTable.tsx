import type { ExtractionResult } from "@/app/lib/form-ocr-types";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { AlertCircle } from "lucide-react";

interface ExtractionResultsTableProps {
  results: ExtractionResult[];
  confidenceThreshold: number;
  onStartReview?: () => void;
}

function confidenceBadge(confidence: number) {
  if (confidence >= 80) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{confidence}%</Badge>;
  }
  if (confidence >= 60) {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{confidence}%</Badge>;
  }
  return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{confidence}%</Badge>;
}

export function ExtractionResultsTable({
  results,
  confidenceThreshold,
  onStartReview,
}: ExtractionResultsTableProps) {
  const flaggedCount = results.filter((r) => r.confidence < confidenceThreshold).length;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Extracted Value</TableHead>
            <TableHead className="w-32 text-center">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, i) => (
            <TableRow
              key={i}
              className={result.confidence < confidenceThreshold ? "bg-red-50" : ""}
            >
              <TableCell className="font-medium">{result.fieldName}</TableCell>
              <TableCell className="font-mono text-sm">
                {result.value || <span className="text-neutral-400 italic">empty</span>}
              </TableCell>
              <TableCell className="text-center">{confidenceBadge(result.confidence)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {flaggedCount > 0 && onStartReview && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <span>
              {flaggedCount} of {results.length} field{flaggedCount !== 1 ? "s" : ""} flagged for
              review (below {confidenceThreshold}% confidence)
            </span>
          </div>
          <Button size="sm" onClick={onStartReview}>
            Review Flagged Fields
          </Button>
        </div>
      )}
    </div>
  );
}
