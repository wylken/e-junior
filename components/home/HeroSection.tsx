import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Star, Wrench, Settings } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/8985916/pexels-photo-8985916.jpeg")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90"></div>
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300/40 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-300/20 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-float" style={{animationDelay: '6s'}}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl animate-slide-up">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            JUNIOR Peças,{' '}
            <span className="gradient-text-accent font-extrabold animate-glow">
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
              className="gradient-accent hover-gradient-shift text-white border-0 font-semibold px-8 py-3 transition-all duration-300 hover-lift animate-glow"
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
              className="glass border-white/30 text-blue-600 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover-scale font-bold"
            >
              <Link href="/servicos" className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Ver Serviços
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gradient-primary p-4 rounded-xl backdrop-blur-md hover-lift animate-scale-in">
              <Shield className="h-8 w-8 text-white mb-2 animate-float" />
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm text-white">Anos de Experiência</div>
            </div>
            <div className="flex flex-col items-center gradient-primary p-4 rounded-xl backdrop-blur-md hover-lift animate-scale-in" style={{animationDelay: '0.2s'}}>
              <Star className="h-8 w-8 text-white mb-2 animate-float" style={{animationDelay: '1s'}} />
              <div className="text-2xl font-bold text-white">5000+</div>
              <div className="text-sm text-white">Clientes Satisfeitos</div>
            </div>
            <div className="flex flex-col items-center gradient-primary p-4 rounded-xl backdrop-blur-md hover-lift animate-scale-in" style={{animationDelay: '0.4s'}}>
              <Wrench className="h-8 w-8 text-white mb-2 animate-float" style={{animationDelay: '2s'}} />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-white">Qualidade Garantida</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}