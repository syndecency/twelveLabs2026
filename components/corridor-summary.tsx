import { MapPin, Calendar } from "lucide-react"
import type { CorridorSummary } from "@/lib/sample-data"

interface CorridorSummaryHeaderProps {
  summary: CorridorSummary
}

export function CorridorSummaryHeader({ summary }: CorridorSummaryHeaderProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{summary.corridorName}</h2>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {summary.overtureCount} registered businesses
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {summary.analysisDate}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        This analysis compares <strong>{summary.overtureCount}</strong> businesses from the Overture 
        registry against <strong>{summary.pegasusCount}</strong> locations identified through 
        street-level video analysis. We detected <strong>{summary.positiveSignals}</strong> positive 
        market signals including new construction and opening announcements, alongside{" "}
        <strong>{summary.negativeSignals}</strong> risk indicators such as vacancies and for-lease signage.
      </p>
    </div>
  )
}
