import { MapHeader } from "@/components/map-header"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MapHeader />
      {children}
    </div>
  )
}
