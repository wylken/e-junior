import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Wrench, 
  Settings, 
  Battery, 
  Gauge, 
  Car, 
  Shield 
} from 'lucide-react';

const mainServices = [
  {
    icon: Wrench,
    title: 'Manutenção Geral',
    description: 'Serviços completos de manutenção preventiva e corretiva para seu veículo.',
    color: '#0093e9'
  },
  {
    icon: Settings,
    title: 'Mecânica Geral',
    description: 'Diagnóstico e reparo de problemas mecânicos com tecnologia avançada.',
    color: '#1E90FF'
  },
  {
    icon: Battery,
    title: 'Elétrica Automotiva',
    description: 'Instalação e reparo de sistemas elétricos, som automotivo e acessórios.',
    color: '#0093e9'
  },
  {
    icon: Gauge,
    title: 'Suspensão e Freios',
    description: 'Especialistas em sistema de freios, suspensão e alinhamento.',
    color: '#1E90FF'
  },
  {
    icon: Car,
    title: 'Peças Originais',
    description: 'Grande variedade de peças originais e compatíveis para todas as marcas.',
    color: '#0093e9'
  },
  {
    icon: Shield,
    title: 'Garantia Total',
    description: 'Todos os serviços com garantia e suporte técnico especializado.',
    color: '#1E90FF'
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#003366] sm:text-4xl lg:text-5xl">
            Nossos Principais Serviços
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Oferecemos soluções completas para seu veículo com qualidade profissional
          </p>
        </div>
        
        <div className="mx-auto mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {mainServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#0093e9]/10 to-[#1E90FF]/10 group-hover:from-[#0093e9]/20 group-hover:to-[#1E90FF]/20 transition-all duration-300">
                    <IconComponent 
                      className="h-8 w-8 transition-colors duration-300" 
                      style={{ color: service.color }}
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-[#003366]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold px-8 py-3 transition-all duration-300"
          >
            <Link href="/servicos">
              Ver Todos os Serviços
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}