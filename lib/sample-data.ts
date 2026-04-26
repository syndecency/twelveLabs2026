import type { FeatureCollection, Point } from "geojson"

// Layer types for the map
export type LayerType = "overture" | "pegasus" | "positive" | "negative"

// Indicator types
export type PositiveIndicator = "new_construction" | "now_opening" | "renovation"
export type NegativeIndicator = "for_lease" | "for_sale" | "boarded_up" | "vacant"

// Business from Overture (existing registry data)
export interface OvertureBusiness {
  id: string
  name: string
  category: string
  address: string
  coordinates: [number, number] // [lng, lat]
}

// Business detected from Pegasus video analysis
export interface PegasusBusiness {
  id: string
  name: string
  category: string
  address: string
  coordinates: [number, number]
  confidence: number
}

// Positive market indicator
export interface PositiveMarkerData {
  id: string
  type: PositiveIndicator
  description: string
  address: string
  coordinates: [number, number]
  confidence: number
}

// Negative market indicator
export interface NegativeMarkerData {
  id: string
  type: NegativeIndicator
  description: string
  address: string
  coordinates: [number, number]
  confidence: number
}

// Layer configuration for styling and display
export const layerConfig: Record<LayerType, { 
  label: string
  color: string
  description: string
}> = {
  overture: { 
    label: "Overture Registry", 
    color: "#6366f1", 
    description: "Existing business registry data" 
  },
  pegasus: { 
    label: "Video Analysis", 
    color: "#06b6d4", 
    description: "Businesses detected via street-level video" 
  },
  positive: { 
    label: "Growth Signals", 
    color: "#10b981", 
    description: "Positive market indicators" 
  },
  negative: { 
    label: "Risk Signals", 
    color: "#ef4444", 
    description: "Vacancy and decline indicators" 
  },
}

export const positiveIndicatorLabels: Record<PositiveIndicator, string> = {
  new_construction: "New Construction",
  now_opening: "Now Opening",
  renovation: "Active Renovation",
}

export const negativeIndicatorLabels: Record<NegativeIndicator, string> = {
  for_lease: "For Lease",
  for_sale: "For Sale",
  boarded_up: "Boarded Up",
  vacant: "Vacant Storefront",
}

// Mock Overture data (existing registry)
export const overtureBusinesses: OvertureBusiness[] = [
  { id: "ov-001", name: "Gateway Coffee Roasters", category: "Cafe", address: "1234 Market St", coordinates: [-90.1994, 38.627] },
  { id: "ov-002", name: "Urban Style Boutique", category: "Retail", address: "1456 Washington Ave", coordinates: [-90.1951, 38.6291] },
  { id: "ov-003", name: "Joe's Classic Diner", category: "Restaurant", address: "2100 Locust St", coordinates: [-90.2023, 38.6315] },
  { id: "ov-004", name: "Gateway Fitness Center", category: "Gym", address: "789 Olive St", coordinates: [-90.1912, 38.6258] },
  { id: "ov-005", name: "Main Street Pharmacy", category: "Pharmacy", address: "3456 Delmar Blvd", coordinates: [-90.2156, 38.6552] },
  { id: "ov-006", name: "Riverside Books", category: "Bookstore", address: "567 Grand Blvd", coordinates: [-90.2089, 38.6178] },
  { id: "ov-007", name: "Tech Solutions Plus", category: "Electronics", address: "1000 Tucker Blvd", coordinates: [-90.1945, 38.6289] },
  { id: "ov-008", name: "Corner Convenience", category: "Convenience", address: "1122 Chestnut St", coordinates: [-90.1967, 38.6301] },
  { id: "ov-009", name: "Noodle House Express", category: "Restaurant", address: "2345 Pine St", coordinates: [-90.2001, 38.6245] },
  { id: "ov-010", name: "City Cleaners", category: "Services", address: "890 Pine St", coordinates: [-90.1878, 38.6334] },
]

// Mock Pegasus data (video-detected businesses)
export const pegasusBusinesses: PegasusBusiness[] = [
  { id: "pg-001", name: "Gateway Coffee Roasters", category: "Cafe", address: "1234 Market St", coordinates: [-90.1994, 38.6272], confidence: 0.96 },
  { id: "pg-002", name: "Urban Threads Collective", category: "Retail", address: "1456 Washington Ave", coordinates: [-90.1951, 38.6293], confidence: 0.89 },
  { id: "pg-003", name: "Gateway Fitness", category: "Gym", address: "789 Olive St", coordinates: [-90.1912, 38.626], confidence: 0.94 },
  { id: "pg-004", name: "The Artisan Bakehouse", category: "Bakery", address: "567 Grand Blvd", coordinates: [-90.2089, 38.618], confidence: 0.87 },
  { id: "pg-005", name: "TechFix Pro", category: "Electronics", address: "1000 Tucker Blvd", coordinates: [-90.1945, 38.6291], confidence: 0.85 },
  { id: "pg-006", name: "Noodle House Express", category: "Restaurant", address: "2345 Pine St", coordinates: [-90.2001, 38.6247], confidence: 0.98 },
  { id: "pg-007", name: "Craft & Draft Taproom", category: "Bar", address: "1800 Olive St", coordinates: [-90.1988, 38.6278], confidence: 0.91 },
  { id: "pg-008", name: "Metro Pet Supply", category: "Pet Store", address: "2200 Market St", coordinates: [-90.2034, 38.6265], confidence: 0.88 },
]

// Mock positive indicators
export const positiveIndicators: PositiveMarkerData[] = [
  { id: "pos-001", type: "new_construction", description: "Mixed-use development, 4 stories", address: "1600 Washington Ave", coordinates: [-90.1975, 38.6305], confidence: 0.94 },
  { id: "pos-002", type: "now_opening", description: "New restaurant opening signage", address: "2050 Locust St", coordinates: [-90.2015, 38.6318], confidence: 0.91 },
  { id: "pos-003", type: "renovation", description: "Facade renovation in progress", address: "1300 Market St", coordinates: [-90.2005, 38.6268], confidence: 0.88 },
  { id: "pos-004", type: "now_opening", description: "Boutique fitness studio opening", address: "850 Olive St", coordinates: [-90.1925, 38.6262], confidence: 0.86 },
  { id: "pos-005", type: "new_construction", description: "Ground-floor retail buildout", address: "3200 Delmar Blvd", coordinates: [-90.2125, 38.6545], confidence: 0.92 },
]

// Mock negative indicators
export const negativeIndicators: NegativeMarkerData[] = [
  { id: "neg-001", type: "for_lease", description: "2,500 sq ft retail space", address: "2100 Locust St", coordinates: [-90.2023, 38.6317], confidence: 0.95 },
  { id: "neg-002", type: "boarded_up", description: "Former pharmacy location", address: "3456 Delmar Blvd", coordinates: [-90.2156, 38.6554], confidence: 0.97 },
  { id: "neg-003", type: "for_sale", description: "Commercial property listing", address: "1122 Chestnut St", coordinates: [-90.1967, 38.6303], confidence: 0.93 },
  { id: "neg-004", type: "vacant", description: "Empty storefront, no signage", address: "890 Pine St", coordinates: [-90.1878, 38.6336], confidence: 0.89 },
  { id: "neg-005", type: "for_lease", description: "Corner retail unit available", address: "1950 Washington Ave", coordinates: [-90.1962, 38.6298], confidence: 0.91 },
  { id: "neg-006", type: "vacant", description: "Cleared out former restaurant", address: "2400 Pine St", coordinates: [-90.2012, 38.6248], confidence: 0.87 },
]

// Convert to GeoJSON collections
export function overtureToGeoJson(data: OvertureBusiness[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: data.map((biz) => ({
      type: "Feature" as const,
      properties: { ...biz, layerType: "overture" as LayerType },
      geometry: { type: "Point" as const, coordinates: biz.coordinates },
    })),
  }
}

export function pegasusToGeoJson(data: PegasusBusiness[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: data.map((biz) => ({
      type: "Feature" as const,
      properties: { ...biz, layerType: "pegasus" as LayerType },
      geometry: { type: "Point" as const, coordinates: biz.coordinates },
    })),
  }
}

export function positiveToGeoJson(data: PositiveMarkerData[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: data.map((marker) => ({
      type: "Feature" as const,
      properties: { ...marker, layerType: "positive" as LayerType },
      geometry: { type: "Point" as const, coordinates: marker.coordinates },
    })),
  }
}

export function negativeToGeoJson(data: NegativeMarkerData[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: data.map((marker) => ({
      type: "Feature" as const,
      properties: { ...marker, layerType: "negative" as LayerType },
      geometry: { type: "Point" as const, coordinates: marker.coordinates },
    })),
  }
}

// Business comparison row for the table
export interface BusinessComparisonRow {
  id: string
  pegasusName: string | null
  overtureName: string | null
  address: string
  confidence: number | null
  status: "match" | "new" | "closed" | "mismatch" | "empty"
}

// Manual comparison data
export function generateComparisonData(): BusinessComparisonRow[] {
  return [
    { id: "cmp-001", pegasusName: null, overtureName: "City Museum & Washington Avenue Parking St Louis", address: "", confidence: null, status: "mismatch" },
    { id: "cmp-002", pegasusName: null, overtureName: "Levels Nigerian Cuisine", address: "", confidence: null, status: "mismatch" },
    { id: "cmp-003", pegasusName: "Buddy", overtureName: "Buddy's Local Grill & Bar", address: "", confidence: null, status: "match" },
    { id: "cmp-004", pegasusName: "window washington", overtureName: "Windows On Washington", address: "", confidence: null, status: "match" },
    { id: "cmp-005", pegasusName: "Boost Mobile", overtureName: "Boost Mobile", address: "", confidence: null, status: "match" },
    { id: "cmp-006", pegasusName: "Flamingo Bowl", overtureName: "Flamingo Bowl", address: "", confidence: null, status: "match" },
    { id: "cmp-007", pegasusName: "Levin's", overtureName: "Levin's", address: "", confidence: null, status: "match" },
    { id: "cmp-008", pegasusName: "World", overtureName: "iWorld Everything Wireless", address: "", confidence: null, status: "match" },
    { id: "cmp-009", pegasusName: "Washington", overtureName: "Blades On Washington", address: "", confidence: null, status: "match" },
    { id: "cmp-010", pegasusName: "For Lease", overtureName: null, address: "", confidence: null, status: "empty" },
    { id: "cmp-011", pegasusName: "Escape Room", overtureName: "Escape The Room St Louis", address: "", confidence: null, status: "match" },
    { id: "cmp-012", pegasusName: "Rosies", overtureName: "Rosalita's Mexican Restaurant", address: "", confidence: null, status: "match" },
    { id: "cmp-013", pegasusName: "ReMax", overtureName: null, address: "", confidence: null, status: "new" },
    { id: "cmp-014", pegasusName: null, overtureName: "Imo's Pizza", address: "", confidence: null, status: "mismatch" },
  ]
}

// Summary for the corridor analysis
export interface CorridorSummary {
  corridorName: string
  analysisDate: string
  overtureCount: number
  pegasusCount: number
  newBusinesses: number
  closedBusinesses: number
  positiveSignals: number
  negativeSignals: number
  vacancyRate: string
  growthScore: number // 0-100
}

export function calculateSummary(): CorridorSummary {
  const overtureNames = new Set(overtureBusinesses.map(b => b.name.toLowerCase()))
  const pegasusNames = new Set(pegasusBusinesses.map(b => b.name.toLowerCase()))
  
  const newBusinesses = pegasusBusinesses.filter(b => !overtureNames.has(b.name.toLowerCase())).length
  const closedBusinesses = overtureBusinesses.filter(b => !pegasusNames.has(b.name.toLowerCase())).length
  
  const totalNegative = negativeIndicators.length
  const totalPositive = positiveIndicators.length
  
  // Simple growth score calculation
  const growthScore = Math.round(
    Math.max(0, Math.min(100, 50 + (totalPositive * 8) - (totalNegative * 6) + (newBusinesses * 5) - (closedBusinesses * 4)))
  )

  return {
    corridorName: "Downtown St. Louis Commercial District",
    analysisDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    overtureCount: overtureBusinesses.length,
    pegasusCount: pegasusBusinesses.length,
    newBusinesses,
    closedBusinesses,
    positiveSignals: totalPositive,
    negativeSignals: totalNegative,
    vacancyRate: `${((totalNegative / (overtureBusinesses.length + pegasusBusinesses.length)) * 100).toFixed(1)}%`,
    growthScore,
  }
}
