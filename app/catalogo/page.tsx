import { PageLayout } from "@/components/page-layout"

export default function CatalogoPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Catálogo
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore nossa coleção de dados e recursos de saneamento
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Camadas de Dados
              </h3>
              <p className="text-muted-foreground mb-4">
                Visualize diferentes tipos de dados de saneamento em formato de camadas interativas
              </p>
              <div className="text-sm text-primary font-medium">
                Disponível em breve
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Relatórios
              </h3>
              <p className="text-muted-foreground mb-4">
                Acesse relatórios detalhados sobre a situação do saneamento em diferentes regiões
              </p>
              <div className="text-sm text-primary font-medium">
                Disponível em breve
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                APIs
              </h3>
              <p className="text-muted-foreground mb-4">
                Integre nossos dados em suas aplicações através de APIs RESTful
              </p>
              <div className="text-sm text-primary font-medium">
                Disponível em breve
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
