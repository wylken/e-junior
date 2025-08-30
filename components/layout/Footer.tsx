import Link from 'next/link';
import { Car, Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="gradient-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 hover-scale">
              <Car className="h-8 w-8 animate-float" />
              <span className="font-bold text-xl">JUNIOR</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sua oficina de confiança há mais de 15 anos. Especialistas em manutenção automotiva, 
              peças e acessórios com qualidade garantida.
            </p>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-amber-300 transition-all duration-300 hover:scale-105">Home</Link></li>
              <li><Link href="/quem-somos" className="text-gray-300 hover:text-amber-300 transition-all duration-300 hover:scale-105">Quem Somos</Link></li>
              <li><Link href="/servicos" className="text-gray-300 hover:text-amber-300 transition-all duration-300 hover:scale-105">Nossos Serviços</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-amber-300 transition-all duration-300 hover:scale-105">Blog</Link></li>
              <li><Link href="/contato" className="text-gray-300 hover:text-amber-300 transition-all duration-300 hover:scale-105">Fale Conosco</Link></li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 hover-scale transition-transform duration-300">
                <Phone className="h-4 w-4 text-white" />
                <span className="text-gray-300">(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2 hover-scale transition-transform duration-300">
                <Mail className="h-4 w-4 text-white" />
                <span className="text-gray-300">contato@juniorpecas.com.br</span>
              </li>
              <li className="flex items-start space-x-2 hover-scale transition-transform duration-300">
                <MapPin className="h-4 w-4 text-white mt-0.5" />
                <span className="text-gray-300">Rua das Oficinas, 123<br />São Paulo - SP</span>
              </li>
            </ul>
          </div>
          
          {/* Horário e Redes Sociais */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Horário de Funcionamento</h3>
            <div className="flex items-start space-x-2 mb-4 hover-scale transition-transform duration-300">
              <Clock className="h-4 w-4 text-white mt-0.5" />
              <div className="text-sm text-gray-300">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover-scale animate-float">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover-scale animate-float" style={{animationDelay: '1s'}}>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-center text-sm text-gray-300">
            © 2025 JUNIOR Peças, Acessórios e Serviços. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}