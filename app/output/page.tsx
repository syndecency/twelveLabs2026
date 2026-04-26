"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { FeatureCollection, Point, Polygon } from "geojson"
import { LayerControls } from "@/components/layer-controls"
import { InsightsPanel } from "@/components/insights-panel"
import { CorridorSummaryHeader } from "@/components/corridor-summary"
import { BusinessComparisonTable } from "@/components/business-comparison-table"
import {
  positiveIndicators,
  negativeIndicators,
  positiveToGeoJson,
  negativeToGeoJson,
  calculateSummary,
  generateComparisonData,
  type LayerType,
} from "@/lib/sample-data"

const MapView = dynamic(
  () => import("@/components/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
)

export default function OutputPage() {
  const [visibleLayers, setVisibleLayers] = useState<Record<LayerType, boolean>>({
    overture: true,
    pegasus: true,
    positive: false,
    negative: false,
  })

  const [videoAnalysisData, setVideoAnalysisData] = useState<FeatureCollection<Point> | null>(null)
  const [overtureData, setOvertureData] = useState<FeatureCollection<Polygon> | null>(null)
  const [selectedPegasusName, setSelectedPegasusName] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/video-analysis.json")
      .then((res) => res.json())
      .then((data) => setVideoAnalysisData(data))
      .catch((err) => console.error("Failed to load video analysis data:", err))

    fetch("/data/overture.json")
      .then((res) => res.json())
      .then((data) => setOvertureData(data))
      .catch((err) => console.error("Failed to load overture data:", err))
  }, [])

  // Use static files for overture and pegasus layers
  const emptyPointGeoJson: FeatureCollection<Point> = { type: "FeatureCollection", features: [] }
  const emptyPolygonGeoJson: FeatureCollection<Polygon> = { type: "FeatureCollection", features: [] }
  
  const layers = {
    overture: overtureData || emptyPolygonGeoJson,
    pegasus: videoAnalysisData || emptyPointGeoJson,
    positive: positiveToGeoJson(positiveIndicators),
    negative: negativeToGeoJson(negativeIndicators),
  }

  const counts: Record<LayerType, number> = {
    overture: overtureData?.features.length || 0,
    pegasus: videoAnalysisData?.features.length || 0,
    positive: positiveIndicators.length,
    negative: negativeIndicators.length,
  }

  const summary = calculateSummary()
  const comparisonData = generateComparisonData()

  const handleLayerToggle = (layer: LayerType) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">BlockSight</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Street-level intelligence on commercial corridor momentum
        </p>
      </header>

      {/* Main Content - 50/50 Split */}
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side - Map (50%) */}
        <section className="flex w-full flex-col p-4 lg:w-1/2 lg:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Corridor Map</h2>
            <p className="text-sm text-muted-foreground">
              Toggle layers to compare registry data with street-level observations
            </p>
          </div>
          <LayerControls
            visibleLayers={visibleLayers}
            onToggle={handleLayerToggle}
            counts={counts}
          />
          <MapView
            layers={layers}
            visibleLayers={visibleLayers}
            selectedPegasusName={selectedPegasusName}
            onMarkerClose={() => setSelectedPegasusName(null)}
            className="mt-4 h-[400px] flex-1 lg:h-auto"
          />
        </section>

        {/* Right Side - Insights & Table (50%) */}
        <aside className="flex w-full flex-col border-t border-border bg-muted/30 p-4 lg:w-1/2 lg:border-l lg:border-t-0 lg:p-6">
          <CorridorSummaryHeader summary={summary} />
          <InsightsPanel summary={summary} className="mt-4" />
          <BusinessComparisonTable 
            data={comparisonData} 
            onRowClick={(pegasusName) => setSelectedPegasusName(pegasusName)}
            className="mt-4 flex-1" 
          />
        </aside>
      </main>
    </div>
  )
}
