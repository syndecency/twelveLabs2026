"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polygon as LeafletPolygon } from "react-leaflet"
import type { Popup as LeafletPopupType } from "leaflet"
import type { FeatureCollection, Point, Polygon, Geometry } from "geojson"
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
  overture: FeatureCollection<Polygon>
  pegasus: FeatureCollection<Point>
  positive: FeatureCollection<Point>
  negative: FeatureCollection<Point>
}

interface MapViewProps {
  layers: LayerData
  visibleLayers: Record<LayerType, boolean>
  selectedPegasusName?: string | null
  onMarkerClose?: () => void
  className?: string
}

interface OpenSelectedPopupProps {
  layers: LayerData
  selectedPegasusName: string | null
}

function OpenSelectedPopup({ layers, selectedPegasusName }: OpenSelectedPopupProps) {
  const map = useMap()

  useEffect(() => {
    if (!selectedPegasusName) return

    // Find the matching feature in pegasus layer
    const matchingFeature = layers.pegasus.features.find((feature) => {
      const textGraphics = (feature.properties as Record<string, unknown>)?.text_graphics as string
      if (!textGraphics) return false
      // Match if the text contains the selected name (case insensitive, partial match)
      return textGraphics.toLowerCase().includes(selectedPegasusName.toLowerCase()) ||
             selectedPegasusName.toLowerCase().includes(textGraphics.toLowerCase())
    })

    if (matchingFeature) {
      const [lng, lat] = matchingFeature.geometry.coordinates
      map.setView([lat, lng], 17, { animate: true })
      
      // Open popup after panning
      setTimeout(() => {
        map.eachLayer((layer) => {
          if ('getLatLng' in layer) {
            const markerLayer = layer as L.CircleMarker
            const markerLatLng = markerLayer.getLatLng()
            if (Math.abs(markerLatLng.lat - lat) < 0.0001 && Math.abs(markerLatLng.lng - lng) < 0.0001) {
              markerLayer.openPopup()
            }
          }
        })
      }, 300)
    }
  }, [selectedPegasusName, layers.pegasus.features, map])

  return null
}

function FitBounds({ layers }: { layers: LayerData }) {
  const map = useMap()

  useEffect(() => {
    const allFeatures = [
      ...layers.overture.features,
      ...layers.pegasus.features,
      ...layers.positive.features,
      ...layers.negative.features,
    ] as { type: "Feature"; geometry: Geometry; properties: unknown }[]

    if (allFeatures.length > 0) {
      const combined = {
        type: "FeatureCollection" as const,
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
  
  if (layerType === "overture") {
    // Parse the names field which is a stringified object
    let businessName = "Unknown Business"
    try {
      const namesStr = properties.names as string
      if (namesStr) {
        const match = namesStr.match(/'primary':\s*'([^']*)'/)
        if (match) businessName = match[1]
      }
    } catch {
      // Keep default name
    }

    // Get address from addresses array
    let address = ""
    const addresses = properties.addresses as Array<{ freeform?: string; locality?: string; region?: string }> | null
    if (addresses && addresses.length > 0) {
      const addr = addresses[0]
      address = [addr.freeform, addr.locality, addr.region].filter(Boolean).join(", ")
    }

    // Get category
    const basicCategory = (properties.basic_category as string)?.replace(/_/g, " ") || ""

    return (
      <div className="min-w-[200px]">
        <div
          className="mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: config.color }}
        >
          {config.label}
        </div>
        <h3 className="font-semibold text-gray-900">{businessName}</h3>
        <p className="text-sm text-gray-600 capitalize">{basicCategory}</p>
        <p className="mt-1 text-xs text-gray-500">{address}</p>
        {properties.confidence && (
          <p className="mt-2 text-xs text-gray-400">
            Confidence: {((properties.confidence as number) * 100).toFixed(0)}%
          </p>
        )}
      </div>
    )
  }

  if (layerType === "pegasus") {
    const textGraphics = properties.text_graphics as string
    const time = properties.time as string
    const frame = properties.frame as number
    const thumbnailSrc = `/images/frame-${frame}.jpg`
    
    // Check if this is Levin's - show video instead of thumbnail
    const isLevins = textGraphics && textGraphics.toLowerCase().includes("levin")
    
    return (
      <div className="min-w-[200px]">
        {isLevins ? (
          <iframe
            src="https://drive.google.com/file/d/1oknRozOKszv9MRE5KPfcC5EopwbcA_ga/preview#t=358"
            className="mb-2 w-full rounded"
            style={{ height: "150px" }}
            allow="autoplay"
            title="Levin's video"
          />
        ) : (
          <img 
            src={thumbnailSrc} 
            alt={`Frame ${frame}`}
            className="mb-2 w-full rounded object-cover"
            style={{ maxHeight: "120px" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none"
            }}
          />
        )}
        <div
          className="mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: config.color }}
        >
          {config.label}
        </div>
        {textGraphics ? (
          <h3 className="font-semibold text-gray-900">{textGraphics}</h3>
        ) : (
          <p className="text-sm text-gray-500 italic">No text detected</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Frame: {frame}</p>
        {time && <p className="text-xs text-gray-400">{new Date(time).toLocaleString()}</p>}
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

export function MapView({ layers, visibleLayers, selectedPegasusName, onMarkerClose, className }: MapViewProps) {
  const popupRefs = useRef<Map<string, L.Popup>>(new Map())
  // Specific addresses and business names to exclude
  const excludedAddresses = [
    "1101 lucas",
    "1101 washington",
    "1221 locust",
    "911 washington",
  ]
  const excludedNames = ["sunsation", "adalo"]

  // Helper to extract address string
  const getAddress = (properties: Record<string, unknown>): string => {
    const addresses = properties.addresses as Array<{ freeform?: string }> | null
    if (addresses && addresses.length > 0 && addresses[0].freeform) {
      return addresses[0].freeform.toLowerCase()
    }
    return ""
  }

  // Helper to extract business name
  const getBusinessName = (properties: Record<string, unknown>): string => {
    try {
      const namesStr = properties.names as string
      if (namesStr) {
        const match = namesStr.match(/'primary':\s*'([^']*)'/)
        if (match) return match[1].toLowerCase()
      }
    } catch {
      // Keep empty
    }
    return ""
  }

  // Helper to extract street number from address
  const getStreetNumber = (address: string): number | null => {
    const match = address.match(/^(\d+)/)
    if (match) return parseInt(match[1], 10)
    return null
  }

  // Check if feature should be excluded
  const shouldExclude = (properties: Record<string, unknown>): boolean => {
    const address = getAddress(properties)
    const name = getBusinessName(properties)
    
    // Filter out addresses 1100 and lower
    const streetNum = getStreetNumber(address)
    if (streetNum !== null && streetNum <= 1100) return true
    
    // Check excluded addresses (partial match)
    for (const excl of excludedAddresses) {
      if (address.includes(excl)) return true
    }
    
    // Check excluded names (partial match)
    for (const excl of excludedNames) {
      if (name.includes(excl)) return true
    }
    
    return false
  }

  // Render polygon layer (Overture)
  const renderPolygonLayer = (
    geoJson: FeatureCollection<Polygon>,
    layerType: LayerType,
    isVisible: boolean
  ) => {
    if (!isVisible) return null

    const config = layerConfig[layerType]

    // Filter out specific addresses and names for overture layer
    const filteredFeatures = layerType === "overture"
      ? geoJson.features.filter((feature) => {
          return !shouldExclude(feature.properties as Record<string, unknown>)
        })
      : geoJson.features

    return filteredFeatures.map((feature, index) => {
      const properties = feature.properties as Record<string, unknown>
      const key = (properties.id as string) || `${layerType}-${index}`
      
      // Convert GeoJSON coordinates to Leaflet format [lat, lng]
      const positions = feature.geometry.coordinates[0].map(
        (coord) => [coord[1], coord[0]] as [number, number]
      )

      return (
        <LeafletPolygon
          key={key}
          positions={positions}
          fillColor={config.color}
          color={config.color}
          weight={2}
          opacity={0.8}
          fillOpacity={0.4}
        >
          <Popup>{renderPopupContent(properties, layerType)}</Popup>
        </LeafletPolygon>
      )
    })
  }

  // Render point layer (Pegasus, Positive, Negative)
  const renderPointLayer = (
    geoJson: FeatureCollection<Point>,
    layerType: LayerType,
    isVisible: boolean
  ) => {
    if (!isVisible) return null

    const config = layerConfig[layerType]

    // Filter out pegasus features with no text detected
    const filteredFeatures = layerType === "pegasus"
      ? geoJson.features.filter((feature) => {
          const textGraphics = (feature.properties as Record<string, unknown>)?.text_graphics
          return textGraphics && String(textGraphics).trim() !== ""
        })
      : geoJson.features

    return filteredFeatures.map((feature, index) => {
      const [lng, lat] = feature.geometry.coordinates
      const properties = feature.properties as Record<string, unknown>
      const key = (properties.id as string) || `${layerType}-${index}`

      return (
        <CircleMarker
          key={key}
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
        {renderPolygonLayer(layers.overture, "overture", visibleLayers.overture)}
        {renderPointLayer(layers.pegasus, "pegasus", visibleLayers.pegasus)}
        {renderPointLayer(layers.positive, "positive", visibleLayers.positive)}
        {renderPointLayer(layers.negative, "negative", visibleLayers.negative)}
        <FitBounds layers={layers} />
        {selectedPegasusName && (
          <OpenSelectedPopup layers={layers} selectedPegasusName={selectedPegasusName} />
        )}
      </MapContainer>
    </div>
  )
}
