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
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-xs text-muted-foreground">For Lease / Sale Sign</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-foreground">
            3
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-xs text-muted-foreground">Boarded Windows</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-muted-foreground italic">
            coming soon
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-muted-foreground">Now Opening Sign</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-muted-foreground italic">
            coming soon
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-muted-foreground">New Construction</span>
          </div>
          <p className="mt-1 text-xl font-semibold text-muted-foreground italic">
            coming soon
          </p>
        </div>
      </div>

      
    </div>
  )
}
