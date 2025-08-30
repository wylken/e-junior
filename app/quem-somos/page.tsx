import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Target, Eye, Heart, Users, Award, Clock } from 'lucide-react';
import Image from 'next/image';

const values = [
  {
    icon: Target,
    title: 'Missão',
    description: 'Oferecer serviços automotivos de excelência, com qualidade, confiabilidade e preços justos, garantindo a satisfação total de nossos clientes.',
    color: '#0093e9'
  },
  {
    icon: Eye,
    title: 'Visão',
    description: 'Ser reconhecida como a melhor oficina automotiva da região, referência em qualidade, tecnologia e atendimento personalizado.',
    color: '#1E90FF'
  },
  {
    icon: Heart,
    title: 'Valores',
    description: 'Honestidade, transparência, qualidade, compromisso com o cliente, inovação constante e responsabilidade social e ambiental.',
    color: '#0093e9'
  }
];

const differentials = [
  {
    icon: Users,
    title: 'Equipe Especializada',
    description: 'Mecânicos certificados e em constante capacitação'
  },
  {
    icon: Award,
    title: 'Qualidade Garantida',
    description: 'Todos os serviços com garantia e peças originais'
  },
  {
    icon: Clock,
    title: '15 Anos de Experiência',
    description: 'Tradição e confiança no mercado automotivo'
  }
];

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#003366] to-[#0093e9] py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Quem Somos
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-200">
                Uma história de dedicação, qualidade e comprometimento com nossos clientes há mais de 15 anos.
              </p>
            </div>
            <div className="relative h-64 lg:h-80 overflow-hidden rounded-lg shadow-xl">
              <Image 
                src="https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg"
                alt="Equipe JUNIOR Oficina"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 lg:h-80 overflow-hidden rounded-lg shadow-lg">
            <Image 
              src="https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg"
              alt="Nossa oficina"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#003366] mb-6">Nossa História</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Fundada em 2010, a JUNIOR Peças, Acessórios e Serviços nasceu do sonho de oferecer 
                serviços automotivos de qualidade com preços justos e atendimento humanizado.
              </p>
              <p>
                Ao longo dos anos, construímos uma reputação sólida baseada na confiança, 
                transparência e excelência técnica. Nossa equipe é formada por profissionais 
                experientes e certificados, sempre em busca da melhor solução para seu veículo.
              </p>
              <p>
                Hoje, somos referência na região, atendendo milhares de clientes satisfeitos 
                e mantendo o compromisso com a qualidade que nos trouxe até aqui.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Missão, Visão, Valores */}
      <Section className="bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#003366] sm:text-4xl">
            Nossos Princípios
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Os valores que nos guiam em cada atendimento
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#0093e9]/10 to-[#1E90FF]/10 group-hover:from-[#0093e9]/20 group-hover:to-[#1E90FF]/20 transition-all duration-300 mb-6">
                    <IconComponent 
                      className="h-8 w-8 transition-colors duration-300" 
                      style={{ color: value.color }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003366] mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Nossos Diferenciais */}
      <Section className="bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#003366] sm:text-4xl">
            Nossos Diferenciais
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            O que nos torna únicos no mercado automotivo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {differentials.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="text-center group">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#0093e9] to-[#1E90FF] group-hover:from-[#007acc] group-hover:to-[#1874CD] transition-all duration-300 mb-6">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#003366] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Footer />
    </main>
  );
}