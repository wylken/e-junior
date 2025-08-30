import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Star, Wrench } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/8985916/pexels-photo-8985916.jpeg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#0093e9]/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            JUNIOR Peças,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E90FF] to-[#00BFFF]">
              Acessórios
            </span>{' '}
            e Serviços
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
            Há mais de 15 anos cuidando do seu veículo com qualidade, confiança e os melhores preços da região. 
            Sua satisfação é nossa prioridade.
          </p>
          
          <div className="mt-8 flex items-center gap-x-6 flex-wrap">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/contato" className="flex items-center">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#003366] transition-all duration-300"
            >
              <Link href="/servicos">
                Ver Serviços
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-[#1E90FF] mb-2" />
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm text-gray-200">Anos de Experiência</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-[#1E90FF] mb-2" />
              <div className="text-2xl font-bold text-white">5000+</div>
              <div className="text-sm text-gray-200">Clientes Satisfeitos</div>
            </div>
            <div className="flex flex-col items-center">
              <Wrench className="h-8 w-8 text-[#1E90FF] mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-200">Qualidade Garantida</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}