"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ComparisonRow {
  id: string
  pegasusName: string | null
  overtureName: string | null
  address: string
  confidence: number | null
  status: "match" | "new" | "closed" | "mismatch"
}

interface BusinessComparisonTableProps {
  data: ComparisonRow[]
  className?: string
}

function getStatusBadge(status: ComparisonRow["status"]) {
  switch (status) {
    case "match":
      return <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">Likely Match</Badge>
    case "new":
      return <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-600">New Store</Badge>
    case "closed":
      return <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-600">Store Closed</Badge>
    case "mismatch":
      return <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600">Not Captured</Badge>
  }
}



export function BusinessComparisonTable({ data, className }: BusinessComparisonTableProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-semibold text-foreground">Business Name Comparison</h3>
        <p className="text-sm text-muted-foreground">Video analysis vs registry data</p>
      </div>
      <div className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Video (Pegasus)</TableHead>
              <TableHead className="text-muted-foreground">Registry (Overture)</TableHead>
              <TableHead className="text-center text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className="border-border">
                <TableCell className="font-medium text-foreground">
                  {row.pegasusName || <span className="text-muted-foreground italic">Not detected</span>}
                </TableCell>
                <TableCell className="text-foreground">
                  {row.overtureName || <span className="text-muted-foreground italic">Not in registry</span>}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(row.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
