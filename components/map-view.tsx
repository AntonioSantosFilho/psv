"use client"

import { useEffect, useRef, useState } from "react"
import { FilterX } from "lucide-react"
import { useMapContext } from "@/components/map-context"

const LAYER_GEOJSON_PATHS: Record<string, string> = {
  bahia: "/data/canudos/Bahia.geojson",
  canudos: "/data/canudos/Canudos.geojson",
  "mascara-canudos": "/data/canudos/Mascara-Canudos.geojson",
  "sede-canudos": "/data/canudos/Sede-Canudos.geojson",
  "localizacao-localidades": "/data/canudos/LOCALIZACAO-COM-LOCALIDADES/localidades.geojson",
  "curvas-nivel-canudos": "/data/canudos/ALTIMETRIA/CURVAS-DE-NIVEL-CANUDOS.geojson",
  drenagem: "/data/canudos/DRENAGEM/drenagem.geojson",
  hidrografia: "/data/canudos/HIDROGRAFIA/hidrografia.geojson",
  hidrogeologico: "/data/canudos/HIDROGEOLOGICO/hidrogeologico.geojson",
  "rodovias-federais-canudos": "/data/canudos/rodovias-federais-canudos.geojson",
  "distritos-canudos": "/data/canudos/DISTRITOS-CANUDOS.geojson",
  "expansao-urbana": "/data/canudos/EXPANSAO-URBANA/expansao-urbana.geojson",
  "geomorfologia-canudos": "/data/canudos/GEOMORFOLOGICO/geomorfologia.geojson",
  "solos-canudos": "/data/canudos/SOLOS/solos-canudos.geojson",
  "unidades-conservacao": "/data/canudos/UNIDADES-DE-CONSERVACAO/unidades-conservacao.geojson",
  "uso-ocupacao-solo": "/data/canudos/USO-E-OCUPACAO-DO-SOLO/uso-ocupacao-solo.geojson",
  "vegetacao-canudos": "/data/canudos/VEGETACAO/VEGETACAO-CANUDOS.geojson",
  cor1: "/data/canudos/Cor1.geojson",
}

/** Propriedade usada para colorir por categoria (legenda). Nomes conforme os GeoJSON convertidos do SHP. */
const LAYER_STYLE_PROPERTY: Record<string, string> = {
  "solos-canudos": "COD_LEGEND",
  "vegetacao-canudos": "legenda",
  "geomorfologia-canudos": "NOM_UNIDAD",
  "hidrogeologico": "DHI_NM_UNI",
  "unidades-conservacao": "cocursodag",
  "uso-ocupacao-solo": "NM_REGIAO",
  "expansao-urbana": "NM_REGIAO",
  drenagem: "cobacia",
  hidrografia: "nome",
  "curvas-nivel-canudos": "ELEV",
  "rodovias-federais-canudos": "ds_legenda",
  "distritos-canudos": "Nome",
  "sede-canudos": "Nome",
}

/** Nomes amigáveis das camadas para o título da legenda. */
const LAYER_NAMES: Record<string, string> = {
  bahia: "Bahia",
  canudos: "Canudos",
  "mascara-canudos": "Mascara Canudos",
  "sede-canudos": "Sede Canudos",
  "localizacao-localidades": "Localização com Localidades",
  "curvas-nivel-canudos": "Curvas de Nível Canudos",
  drenagem: "Drenagem",
  hidrografia: "Hidrografia",
  hidrogeologico: "Hidrogeológico",
  "rodovias-federais-canudos": "Rodovias federais Canudos",
  "distritos-canudos": "Distritos Canudos",
  "expansao-urbana": "Expansão Urbana",
  "geomorfologia-canudos": "Geomorfologia Canudos",
  "solos-canudos": "Solos Canudos",
  "unidades-conservacao": "Unidades de Conservação",
  "uso-ocupacao-solo": "Uso e Ocupação do Solo",
  "vegetacao-canudos": "Vegetação Canudos",
  cor1: "Cor1",
}

const PALETTE = [
  "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
  "#14b8a6", "#eab308", "#dc2626", "#a855f7", "#d946ef",
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0
  return Math.abs(h)
}

function getColorForValue(value: string): string {
  return PALETTE[hashString(String(value)) % PALETTE.length]
}

/**
 * Corrige texto que está em UTF-8 mas foi lido como Latin-1 (comum em shapefiles antigos).
 * Ex.: "DepressÃ£o" → "Depressão", "JatobÃ¡" → "Jatobá"
 */
function fixLatin1Mojibake(str: string): string {
  if (!str || /^[\x00-\x7F]*$/.test(str)) return str
  try {
    const bytes = new Uint8Array([...str].map((c) => c.charCodeAt(0) & 0xff))
    return new TextDecoder("utf-8").decode(bytes)
  } catch {
    return str
  }
}

/** Normaliza valor para legenda (remove null chars, corrige encoding e trim). */
function normalizeLegendValue(v: unknown): string {
  const raw = String(v ?? "").replace(/\u0000/g, "").trim()
  const s = fixLatin1Mojibake(raw)
  return s || "—"
}

/** Tenta obter valor de estilo a partir das propriedades: primeiro a configurada, depois fallbacks. */
function getStyleValue(props: Record<string, unknown> | null, layerId: string): string | null {
  if (!props) return null
  const configured = LAYER_STYLE_PROPERTY[layerId]
  if (configured && props[configured] != null) return normalizeLegendValue(props[configured])
  const fallbacks = ["LEGENDA", "legenda", "NOM_UNIDAD", "nome", "Nome", "CLASSE", "COD_LEGEND", "DHI_NM_UNI", "ds_legenda", "cobacia", "ELEV"]
  for (const key of fallbacks) {
    if (props[key] != null) return normalizeLegendValue(props[key])
  }
  for (const [k, v] of Object.entries(props)) {
    if (v != null && typeof v === "string" && v.length > 0 && v.length < 200) return normalizeLegendValue(v)
  }
  return null
}

function isLineGeometry(feature: { geometry?: { type?: string } }): boolean {
  const t = feature?.geometry?.type
  return t === "LineString" || t === "MultiLineString"
}

function darkerHex(hex: string, factor = 0.7): string {
  const m = hex.slice(1).match(/.{2}/g)
  if (!m) return hex
  const r = Math.floor(parseInt(m[0], 16) * factor)
  const g = Math.floor(parseInt(m[1], 16) * factor)
  const b = Math.floor(parseInt(m[2], 16) * factor)
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

export function MapView() {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const layerGroupsRef = useRef<{ [key: string]: any }>({})
  const selectedLayersRef = useRef<string[]>([])
  const { selectedLayers, setSelectedLayers, setLayerLegendEntries, layerLegendEntries } = useMapContext()
  const [isClient, setIsClient] = useState(false)
  selectedLayersRef.current = selectedLayers

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isClient || !containerRef.current || mapRef.current) return

    let isMounted = true

    // Import Leaflet dynamically only on client side
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css")
    ]).then(([leafletModule]) => {
      if (!isMounted || !containerRef.current || mapRef.current) return

      const L = leafletModule.default
      // Usar ícones em /leaflet/ para evitar 404 (marker-icon.png, marker-icon-2x.png, marker-shadow.png)
      L.Icon.Default.mergeOptions({
        iconUrl: "/leaflet/marker-icon.png",
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      })
      const map = L.map(containerRef.current, {
        center: [-15.7801, -47.9292], // Brasília, Brasil
        zoom: 4,
        zoomControl: true,
      })

      mapRef.current = map

      // Create base layers
      const lightLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      })

      const darkLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      })

      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      })

      const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution:
          '&copy; <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19,
      })

      // Add default layer
      lightLayer.addTo(map)

      // Add layer control
      const baseLayers = {
        "Claro": lightLayer,
        "Escuro": darkLayer,
        "OpenStreetMap": osmLayer,
        "Satélite": satelliteLayer,
      }

      L.control.layers(baseLayers).addTo(map)
    })

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        layerGroupsRef.current = {}
      }
    }
  }, [isClient])

  // Handle layer visibility: load GeoJSON from LAYER_GEOJSON_PATHS and add/remove from map
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    selectedLayers.forEach((layerId) => {
      const path = LAYER_GEOJSON_PATHS[layerId]
      if (!path) return

      const existing = layerGroupsRef.current[layerId]
      if (existing) {
        map.addLayer(existing)
        return
      }

      import("leaflet").then((leafletModule) => {
        const L = leafletModule.default
        fetch(path)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
          })
          .then((geojson) => {
            if (!selectedLayersRef.current.includes(layerId)) return
            const defaultStyle = { color: "#0ea5e9", weight: 2, fillColor: "#0ea5e9", fillOpacity: 0.3 }
            const legendEntriesMap = new Map<string, string>()

            const geoJsonLayer = L.geoJSON(geojson, {
              style: (feature: any) => {
                const props = feature?.properties
                const value = getStyleValue(props, layerId)
                if (value != null && value !== "—") {
                  const fillColor = getColorForValue(value)
                  legendEntriesMap.set(value, fillColor)
                  const base = {
                    color: darkerHex(fillColor),
                    weight: 2,
                  }
                  if (isLineGeometry(feature)) {
                    return { ...base, weight: 3 }
                  }
                  return { ...base, fillColor, fillOpacity: 0.4 }
                }
                if (isLineGeometry(feature)) return { color: "#0ea5e9", weight: 2 }
                return defaultStyle
              },
              onEachFeature: (feature: any, layer: any) => {
                const props = feature.properties as Record<string, unknown> | null
                if (!props) return
                const rows = Object.entries(props)
                  .map(([k, v]) => `<div style="display: flex; justify-content: space-between; padding: 4px 0;"><span style="font-weight: 600; color: #4b5563;">${fixLatin1Mojibake(k)}:</span><span style="color: #1f2937;">${fixLatin1Mojibake(String(v ?? ""))}</span></div>`)
                  .join("")
                const popupHtml = `<div style="padding: 12px; min-width: 180px; max-height: 240px; overflow-y: auto;">${rows}</div>`
                layer.bindPopup(popupHtml, { maxWidth: 300, className: "custom-popup" })
              },
            })

            const legendEntries = Array.from(legendEntriesMap.entries())
              .filter(([value]) => value !== "—" && value.length > 0)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([value, color]) => ({ value, color }))
            setLayerLegendEntries(layerId, legendEntries)

            layerGroupsRef.current[layerId] = geoJsonLayer
            if (mapRef.current && selectedLayersRef.current.includes(layerId)) {
              mapRef.current.addLayer(geoJsonLayer)
            }
          })
          .catch((err) => {
            console.warn(`GeoJSON não carregado para ${layerId}:`, err.message)
          })
      })
    })

    Object.keys(layerGroupsRef.current).forEach((layerId) => {
      if (!selectedLayers.includes(layerId)) {
        map.removeLayer(layerGroupsRef.current[layerId])
        // Não limpar legendEntries aqui: ao reativar a camada usamos o cache e a legenda volta a aparecer
      }
    })
  }, [selectedLayers])

  const layersWithLegend = selectedLayers.filter((id) => (layerLegendEntries[id]?.length ?? 0) > 0)

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />
      {/* Botão Limpar filtros — canto inferior esquerdo */}
      <button
        type="button"
        onClick={() => setSelectedLayers([])}
        disabled={selectedLayers.length === 0}
        className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 py-2 px-3 rounded-lg bg-white/95 border border-sky-300 text-sm font-medium text-sky-800 shadow-lg backdrop-blur-sm hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FilterX className="h-4 w-4 shrink-0" />
        Limpar filtros
      </button>
      {/* Legenda sobreposta ao mapa */}
      {layersWithLegend.length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] w-56 max-h-[70vh] overflow-y-auto rounded-lg border border-sky-300 bg-white/95 shadow-lg backdrop-blur-sm">
          <div className="p-3 border-b border-sky-200 bg-sky-50/80 sticky top-0 rounded-t-lg">
            <span className="text-xs font-semibold text-sky-800">Legenda</span>
          </div>
          <div className="p-3 space-y-4">
            {layersWithLegend.map((layerId) => {
              const entries = layerLegendEntries[layerId] ?? []
              const name = LAYER_NAMES[layerId] ?? layerId
              return (
                <div key={layerId}>
                  <h3 className="text-xs font-medium text-gray-700 mb-2">{name}</h3>
                  <ul className="space-y-1.5">
                    {entries.map(({ value, color }) => (
                      <li key={value} className="flex items-center gap-2 text-xs text-gray-800">
                        <span
                          className="shrink-0 w-3.5 h-3.5 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
