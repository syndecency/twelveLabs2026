import { TrendingUp, TrendingDown, Building2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CorridorSummary } from "@/lib/sample-data"

interface InsightsPanelProps {
  summary: CorridorSummary
  className?: string
}

export function InsightsPanel({ summary, className }: InsightsPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600"
    if (score >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Strong Growth"
    if (score >= 40) return "Moderate Activity"
    return "Declining Market"
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Growth Score */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Market Health Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(summary.growthScore)}`}>
              {summary.growthScore}
            </p>
            <p className={`text-sm font-medium ${getScoreColor(summary.growthScore)}`}>
              {getScoreLabel(summary.growthScore)}
            </p>
          </div>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${
                summary.growthScore >= 70 ? "#10b981" : summary.growthScore >= 40 ? "#f59e0b" : "#ef4444"
              } ${summary.growthScore * 3.6}deg, #e5e7eb 0deg)`,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card">
              <span className="text-sm font-semibold">{summary.growthScore}</span>
            </div>
          </div>
        </div>
      </div>

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
