import { MapView } from "@/components/map-view"
import { MapHeader } from "@/components/map-header"
import { MapFilters } from "@/components/map-filters"
import { MapProvider } from "@/components/map-context"

export default function Home() {
  return (
    <MapProvider>
      <div className="flex h-screen flex-col border-t border-gray-300">
        <MapHeader />
        <div className="flex flex-1 overflow-hidden border-t border-gray-300">
          <MapFilters />
          <main className="flex-1 border-l border-gray-300">
            <MapView />
          </main>
        </div>
      </div>
    </MapProvider>
  )
}
