"use client"

import { Switch } from "@/components/ui/switch"
import { layerConfig, type LayerType } from "@/lib/sample-data"

interface LayerControlsProps {
  visibleLayers: Record<LayerType, boolean>
  onToggle: (layer: LayerType) => void
  counts: Record<LayerType, number>
}

export function LayerControls({ visibleLayers, onToggle, counts }: LayerControlsProps) {
  const layers: LayerType[] = ["overture", "pegasus"]

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Map Layers</h3>
      <div className="space-y-3">
        {layers.map((layer) => {
          const config = layerConfig[layer]
          return (
            <div key={layer} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {config.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {counts[layer]} locations
                  </span>
                </div>
              </div>
              <Switch
                checked={visibleLayers[layer]}
                onCheckedChange={() => onToggle(layer)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
