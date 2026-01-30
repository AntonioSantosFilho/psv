import { PageLayout } from "@/components/page-layout"

export default function SobrePage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            Sobre o PSV
          </h1>
          <p className="text-lg text-muted-foreground mb-8 font-medium">
            Conheça mais sobre o Painel Saneamento Vivo
          </p>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                O que é o PSV?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O Painel Saneamento Vivo (PSV) é uma plataforma interativa desenvolvida para 
                visualizar e analisar dados de saneamento de forma dinâmica e acessível. 
                Nossa missão é democratizar o acesso à informação sobre saneamento, 
                fornecendo ferramentas intuitivas para pesquisadores, gestores públicos 
                e cidadãos interessados em compreender a realidade do saneamento no Brasil.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  🎯 Nossa Missão
                </h3>
                <p className="text-muted-foreground">
                  Democratizar o acesso à informação sobre saneamento, 
                  promovendo transparência e facilitando a tomada de decisões 
                  baseadas em dados.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  👁️ Nossa Visão
                </h3>
                <p className="text-muted-foreground">
                  Ser a principal referência em visualização de dados 
                  de saneamento, contribuindo para um Brasil mais justo 
                  e sustentável.
                </p>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Funcionalidades Principais
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Visualização interativa de dados de saneamento em mapas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Filtros avançados para análise de dados específicos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Camadas de dados customizáveis e sobreposíveis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Exportação de dados e relatórios</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Interface responsiva e acessível</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
