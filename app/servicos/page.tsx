import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { Wrench, Settings, Battery, Gauge, Car, Shield, Wine as Engine, Thermometer, Zap, Disc, ShipWheel as Wheels, Fuel, Radio, Wind, PenTool as Tool, CheckCircle } from 'lucide-react';

const allServices = [
  {
    category: 'Manutenção Geral',
    services: [
      { icon: Wrench, name: 'Revisão Completa', description: 'Verificação geral de todos os sistemas do veículo' },
      { icon: Engine, name: 'Troca de Óleo', description: 'Óleo motor, filtros e verificação de fluidos' },
      { icon: Thermometer, name: 'Sistema de Arrefecimento', description: 'Radiador, bomba d\'água e termostato' },
      { icon: Fuel, name: 'Sistema de Combustível', description: 'Limpeza de bicos injetores e bomba de combustível' }
    ]
  },
  {
    category: 'Mecânica Especializada',
    services: [
      { icon: Settings, name: 'Diagnóstico Computadorizado', description: 'Scanner automotivo para identificar problemas' },
      { icon: Engine, name: 'Motor e Transmissão', description: 'Reparo e manutenção do motor e câmbio' },
      { icon: Disc, name: 'Embreagem', description: 'Disco, platô e atuador de embreagem' },
      { icon: Tool, name: 'Retífica de Motor', description: 'Serviços de retífica e recondicionamento' }
    ]
  },
  {
    category: 'Sistema Elétrico',
    services: [
      { icon: Battery, name: 'Sistema Elétrico', description: 'Bateria, alternador e motor de partida' },
      { icon: Zap, name: 'Instalação Elétrica', description: 'Fiação, fusíveis e componentes elétricos' },
      { icon: Radio, name: 'Som Automotivo', description: 'Instalação e reparo de sistemas de som' },
      { icon: Zap, name: 'Ar Condicionado', description: 'Instalação, manutenção e reparo' }
    ]
  },
  {
    category: 'Suspensão e Freios',
    services: [
      { icon: Gauge, name: 'Sistema de Freios', description: 'Pastilhas, discos e fluido de freio' },
      { icon: Wheels, name: 'Suspensão', description: 'Amortecedores, molas e buchas' },
      { icon: Gauge, name: 'Alinhamento e Balanceamento', description: 'Geometria das rodas e calibragem' },
      { icon: Wheels, name: 'Pneus e Rodas', description: 'Venda e instalação de pneus' }
    ]
  }
];

export default function ServicosPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#003366] to-[#0093e9] py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Nossos Serviços
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-200 max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços automotivos com qualidade profissional, 
            tecnologia avançada e garantia em todos os trabalhos realizados.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <Section className="bg-white">
        <div className="space-y-16">
          {allServices.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">
                {category.category}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.services.map((service, serviceIndex) => {
                  const IconComponent = service.icon;
                  return (
                    <Card key={serviceIndex} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#0093e9]/10 to-[#1E90FF]/10 group-hover:from-[#0093e9]/20 group-hover:to-[#1E90FF]/20 transition-all duration-300 mb-4">
                          <IconComponent className="h-8 w-8 text-[#1E90FF]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#003366] mb-2">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Precisa de Algum Desses Serviços?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para cuidar do seu veículo com toda a qualidade e profissionalismo que você merece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold px-8 py-3 transition-all duration-300"
            >
              <Link href="/contato">
                Solicitar Orçamento
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-300"
            >
              <Link href="/contato">
                Falar no WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}