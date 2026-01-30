import Link from "next/link"
import Image from "next/image"

export function MapHeader() {
  return (
    <header className="border-b border-gray-300 bg-sky-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 pl-12">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Projeto Saneamento Vivo"
              width={150}
              height={75}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {/* Navigation Menu */}
          <nav className="flex items-center gap-6">
            <Link href="/tutorial" className="text-lg font-medium text-black hover:text-gray-700 transition-colors border-b border-transparent hover:border-black">
              Tutorial
            </Link>
            <Link href="/catalogo" className="text-lg font-medium text-black hover:text-gray-700 transition-colors border-b border-transparent hover:border-black">
              Catálogo
            </Link>
            <Link href="/sobre" className="text-lg font-medium text-black hover:text-gray-700 transition-colors border-b border-transparent hover:border-black">
              Sobre
            </Link>
            <Link href="/fale-conosco" className="text-lg font-medium text-black hover:text-gray-700 transition-colors border-b border-transparent hover:border-black">
              Fale Conosco
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
