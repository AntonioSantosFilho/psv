import { PageLayout } from "@/components/page-layout"

export default function TutorialPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Tutorial
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Aprenda a usar o PSV - Painel Saneamento Vivo
          </p>
          
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Tutorial em Desenvolvimento
            </h2>
            <p className="text-muted-foreground mb-6">
              Estamos preparando um tutorial completo para ajudá-lo a utilizar 
              todas as funcionalidades do PSV. Em breve você terá acesso a:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <span className="text-primary mr-3">📊</span>
                <span className="text-muted-foreground">Como navegar pelos dados</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">🗺️</span>
                <span className="text-muted-foreground">Usando os filtros do mapa</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">📈</span>
                <span className="text-muted-foreground">Interpretando os gráficos</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3">💾</span>
                <span className="text-muted-foreground">Exportando dados</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Volte em breve!</strong> O tutorial estará disponível 
                nas próximas semanas com vídeos explicativos e guias passo a passo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
