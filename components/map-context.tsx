"use client"

import { createContext, useCallback, useContext, useState, ReactNode } from "react"

export interface LegendEntry {
  value: string
  color: string
}

interface MapContextType {
  selectedLayers: string[]
  toggleLayer: (layerId: string) => void
  setSelectedLayers: (layers: string[]) => void
  layerLegendEntries: Record<string, LegendEntry[]>
  setLayerLegendEntries: (layerId: string, entries: LegendEntry[]) => void
}

const MapContext = createContext<MapContextType | undefined>(undefined)

export function MapProvider({ children }: { children: ReactNode }) {
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [layerLegendEntries, setLayerLegendEntriesState] = useState<Record<string, LegendEntry[]>>({})

  const toggleLayer = (layerId: string) => {
    setSelectedLayers((prev) => 
      prev.includes(layerId) 
        ? prev.filter((id) => id !== layerId) 
        : [...prev, layerId]
    )
  }

  const setLayerLegendEntries = useCallback((layerId: string, entries: LegendEntry[]) => {
    setLayerLegendEntriesState((prev) => ({ ...prev, [layerId]: entries }))
  }, [])

  return (
    <MapContext.Provider value={{ selectedLayers, toggleLayer, setSelectedLayers, layerLegendEntries, setLayerLegendEntries }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMapContext() {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider")
  }
  return context
}
