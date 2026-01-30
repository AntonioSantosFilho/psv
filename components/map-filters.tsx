"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Layers, Filter, ChevronDown, Search, ChevronRight, Info, Star, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useMapContext } from "@/components/map-context"

const layerCategories = [
  {
    name: "LOCALIZAÇÃO",
    layers: [
      { id: "bahia", name: "Bahia", color: "bg-chart-1" },
      { id: "canudos", name: "Canudos", color: "bg-chart-2" },
      { id: "mascara-canudos", name: "Mascara Canudos", color: "bg-chart-3" },
      { id: "sede-canudos", name: "Sede Canudos", color: "bg-chart-4" },
      { id: "localizacao-localidades", name: "Localização com Localidades", color: "bg-chart-5" },
    ],
  },
  {
    name: "ALTIMETRIA",
    layers: [
      { id: "curvas-nivel-canudos", name: "Curvas de Nível Canudos", color: "bg-chart-1" },
    ],
  },
  {
    name: "DRENAGEM",
    layers: [
      { id: "drenagem", name: "Drenagem", color: "bg-chart-1" },
    ],
  },
  {
    name: "HIDROGRAFIA",
    layers: [
      { id: "hidrografia", name: "Hidrografia", color: "bg-chart-1" },
    ],
  },
  {
    name: "HIDROGEOLÓGICO",
    layers: [
      { id: "hidrogeologico", name: "Hidrogeológico", color: "bg-chart-1" },
    ],
  },
  {
    name: "RODOVIAS E VIÁRIO",
    layers: [
      { id: "rodovias-federais-canudos", name: "Rodovias federais Canudos", color: "bg-chart-1" },
    ],
  },
  {
    name: "DISTRITOS",
    layers: [
      { id: "distritos-canudos", name: "Distritos Canudos", color: "bg-chart-1" },
    ],
  },
  {
    name: "EXPANSÃO URBANA",
    layers: [
      { id: "expansao-urbana", name: "Expansão Urbana", color: "bg-chart-1" },
    ],
  },
  {
    name: "GEOMORFOLÓGICO",
    layers: [
      { id: "geomorfologia-canudos", name: "Geomorfologia Canudos", color: "bg-chart-1" },
    ],
  },
  {
    name: "SOLOS",
    layers: [
      { id: "solos-canudos", name: "Solos Canudos", color: "bg-chart-1" },
    ],
  },
  {
    name: "UNIDADES DE CONSERVAÇÃO",
    layers: [
      { id: "unidades-conservacao", name: "Unidades de Conservação", color: "bg-chart-1" },
    ],
  },
  {
    name: "USO E OCUPAÇÃO DO SOLO",
    layers: [
      { id: "uso-ocupacao-solo", name: "Uso e Ocupação do Solo", color: "bg-chart-1" },
    ],
  },
  {
    name: "VEGETAÇÃO",
    layers: [
      { id: "vegetacao-canudos", name: "Vegetação Canudos", color: "bg-chart-1" },
    ],
  },
  {
    name: "OUTROS",
    layers: [
      { id: "cor1", name: "Cor1", color: "bg-chart-1" },
    ],
  },
]

export function MapFilters() {
  const { selectedLayers, toggleLayer } = useMapContext()
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName)
    setActiveSubcategory(null)
  }

  const toggleSubcategory = (subcategoryName: string) => {
    setActiveSubcategory(activeSubcategory === subcategoryName ? null : subcategoryName)
  }

  return (
    <div className="flex h-full">
      {/* Menu Principal */}
      <aside className="w-80 border-r border-sky-200 bg-sky-50 overflow-y-auto">
        <div className="p-6">

          {/* Campo de Busca */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
              <Input 
                placeholder="Pesquisar por mapas..." 
                className="pl-12 pr-10 h-12 bg-white border border-black text-black placeholder:text-gray-500 focus:border-black focus:ring-black text-base" 
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-700">
                ×
              </button>
            </div>
          </div>

          {/* Categorias Principais */}
          <div className="space-y-2">
            {layerCategories.map((category) => (
              <div key={category.name} className="relative">
                {/* Categoria Principal */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={`w-full flex items-center justify-center p-4 rounded-lg transition-all duration-200 text-center border border-black ${
                    expandedCategory === category.name 
                      ? 'bg-sky-500 text-white border-black' 
                      : 'hover:bg-sky-100 text-black'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">{category.name}</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${
                      expandedCategory === category.name ? 'rotate-180 text-white' : 'text-black'
                    }`} />
                  </div>
                </button>

                {/* Subcategorias */}
                {expandedCategory === category.name && category.subcategories && (
                  <div className="mt-2 space-y-1 pl-4">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.name}
                        onClick={() => toggleSubcategory(subcategory.name)}
                        className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 text-center border border-black ${
                          activeSubcategory === subcategory.name 
                            ? 'bg-sky-500 text-white border-black' 
                            : 'hover:bg-sky-100 text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{subcategory.name}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
                            activeSubcategory === subcategory.name ? 'rotate-90 text-white' : 'text-black'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Camadas Diretas (para categorias sem subcategorias) */}
                {expandedCategory === category.name && !category.subcategories && category.layers && (
                  <div className="mt-2 space-y-1 pl-4">
                    {category.layers.map((layer) => (
                      <div key={layer.id} className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-sky-100 border border-black">
                        <Checkbox
                          id={layer.id}
                          checked={selectedLayers.includes(layer.id)}
                          onCheckedChange={() => toggleLayer(layer.id)}
                          className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-black border border-black"
                        />
                        <div className={`h-3 w-3 rounded-full ${layer.color} border border-black`} />
                        <Label htmlFor={layer.id} className="cursor-pointer text-sm text-black">
                          {layer.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* MAPAS ATIVOS */}
          <div className="mt-8 p-4 bg-sky-500 rounded-lg border border-black text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-medium text-black">MAPAS ATIVOS</span>
              <span className="text-lg font-bold text-black">{selectedLayers.length}</span>
              <Info className="h-4 w-4 text-black" />
            </div>
          </div>

        </div>
      </aside>

      {/* Submenu Lateral (Fly-out) */}
      {activeSubcategory && (
        <aside className="w-96 border-r border-sky-200 bg-sky-50 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <button 
                onClick={() => setActiveSubcategory(null)}
                className="flex items-center justify-center gap-2 text-black hover:text-gray-700 mb-4 border-b border-transparent hover:border-black"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Voltar
              </button>
              <h2 className="text-xl font-bold text-black border-b border-black pb-2 text-center">
                {layerCategories
                  .find(cat => expandedCategory === cat.name)
                  ?.subcategories?.find(sub => activeSubcategory === sub.name)?.name}
              </h2>
            </div>

            <div className="space-y-3">
              {layerCategories
                .find(cat => expandedCategory === cat.name)
                ?.subcategories?.find(sub => activeSubcategory === sub.name)
                ?.layers.map((layer) => (
                  <div key={layer.id} className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg hover:bg-sky-50 transition-colors border border-black">
                    <Checkbox
                      id={layer.id}
                      checked={selectedLayers.includes(layer.id)}
                      onCheckedChange={() => toggleLayer(layer.id)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-black border border-black"
                    />
                    <div className={`h-4 w-4 rounded-full ${layer.color} border border-black`} />
                    <Label htmlFor={layer.id} className="cursor-pointer text-black font-medium">
                      {layer.name}
                    </Label>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-sky-100 rounded border border-black">
                        <Info className="h-4 w-4 text-black" />
                      </button>
                      <button className="p-1 hover:bg-sky-100 rounded border border-black">
                        <Star className="h-4 w-4 text-black" />
                      </button>
                      <button className="p-1 hover:bg-sky-100 rounded border border-black">
                        {selectedLayers.includes(layer.id) ? (
                          <Eye className="h-4 w-4 text-black" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-black" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
