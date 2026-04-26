import { TrendingUp, TrendingDown, Building2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CorridorSummary } from "@/lib/sample-data"

interface InsightsPanelProps {
  summary: CorridorSummary
  className?: string
}

export function InsightsPanel({ summary, className }: InsightsPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-muted-foreground">New Businesses</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {summary.newBusinesses}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-xs text-muted-foreground">Closed</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {summary.closedBusinesses}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-muted-foreground">Growth Signals</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {summary.positiveSignals}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-xs text-muted-foreground">Risk Signals</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {summary.negativeSignals}
          </p>
        </div>
      </div>

      
    </div>
  )
}
