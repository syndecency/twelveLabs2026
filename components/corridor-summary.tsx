import { Calendar } from "lucide-react"
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
              <Calendar className="h-3.5 w-3.5" />
              {summary.analysisDate}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Mixed signals on the ground. 4 active for-lease listings and 2 boarded storefronts point to turnover, but steady foot traffic and a healthy mix of open businesses suggest the corridor is still drawing people.
      </p>
    </div>
  )
}
