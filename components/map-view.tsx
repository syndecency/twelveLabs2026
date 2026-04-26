"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import type { FeatureCollection, Point } from "geojson"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  layerConfig,
  positiveIndicatorLabels,
  negativeIndicatorLabels,
  type LayerType,
  type PositiveIndicator,
  type NegativeIndicator,
} from "@/lib/sample-data"

interface LayerData {
  overture: FeatureCollection<Point>
  pegasus: FeatureCollection<Point>
  positive: FeatureCollection<Point>
  negative: FeatureCollection<Point>
}

interface MapViewProps {
  layers: LayerData
  visibleLayers: Record<LayerType, boolean>
  className?: string
}

function FitBounds({ layers }: { layers: LayerData }) {
  const map = useMap()

  useEffect(() => {
    const allFeatures = [
      ...layers.overture.features,
      ...layers.pegasus.features,
      ...layers.positive.features,
      ...layers.negative.features,
    ]

    if (allFeatures.length > 0) {
      const combined: FeatureCollection<Point> = {
        type: "FeatureCollection",
        features: allFeatures,
      }
      const bounds = L.geoJSON(combined).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [layers, map])

  return null
}

function renderPopupContent(properties: Record<string, unknown>, layerType: LayerType) {
  const config = layerConfig[layerType]
  
  if (layerType === "overture" || layerType === "pegasus") {
    return (
      <div className="min-w-[200px]">
        <div
          className="mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: config.color }}
        >
          {config.label}
        </div>
        <h3 className="font-semibold text-gray-900">{properties.name as string}</h3>
        <p className="text-sm text-gray-600">{properties.category as string}</p>
        <p className="mt-1 text-xs text-gray-500">{properties.address as string}</p>
        {properties.confidence && (
          <p className="mt-2 text-xs text-gray-400">
            Confidence: {((properties.confidence as number) * 100).toFixed(0)}%
          </p>
        )}
      </div>
    )
  }

  // Positive or negative indicator
  const indicatorType = properties.type as string
  const label = layerType === "positive" 
    ? positiveIndicatorLabels[indicatorType as PositiveIndicator]
    : negativeIndicatorLabels[indicatorType as NegativeIndicator]

  return (
    <div className="min-w-[200px]">
      <div
        className="mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium text-white"
        style={{ backgroundColor: config.color }}
      >
        {label}
      </div>
      <p className="text-sm text-gray-700">{properties.description as string}</p>
      <p className="mt-1 text-xs text-gray-500">{properties.address as string}</p>
      <p className="mt-2 text-xs text-gray-400">
        Confidence: {((properties.confidence as number) * 100).toFixed(0)}%
      </p>
    </div>
  )
}

export function MapView({ layers, visibleLayers, className }: MapViewProps) {
  const renderLayer = (
    geoJson: FeatureCollection<Point>,
    layerType: LayerType,
    isVisible: boolean
  ) => {
    if (!isVisible) return null

    const config = layerConfig[layerType]

    return geoJson.features.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates
      const properties = feature.properties as Record<string, unknown>

      return (
        <CircleMarker
          key={properties.id as string}
          center={[lat, lng]}
          radius={layerType === "positive" || layerType === "negative" ? 8 : 10}
          fillColor={config.color}
          color="#fff"
          weight={2}
          opacity={1}
          fillOpacity={0.85}
        >
          <Popup>{renderPopupContent(properties, layerType)}</Popup>
        </CircleMarker>
      )
    })
  }

  return (
    <div className={className}>
      <MapContainer
        center={[38.627, -90.1994]}
        zoom={14}
        className="h-full w-full rounded-lg"
        style={{ minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {renderLayer(layers.overture, "overture", visibleLayers.overture)}
        {renderLayer(layers.pegasus, "pegasus", visibleLayers.pegasus)}
        {renderLayer(layers.positive, "positive", visibleLayers.positive)}
        {renderLayer(layers.negative, "negative", visibleLayers.negative)}
        <FitBounds layers={layers} />
      </MapContainer>
    </div>
  )
}
