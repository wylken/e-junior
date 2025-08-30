import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/forms/ContactForm';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Navigation
} from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefone',
    details: ['(11) 9999-9999', '(11) 3333-3333'],
    description: 'Ligue para nós'
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['contato@juniorpecas.com.br', 'orcamento@juniorpecas.com.br'],
    description: 'Envie sua dúvida'
  },
  {
    icon: MapPin,
    title: 'Endereço',
    details: ['Rua das Oficinas, 123', 'São Paulo - SP, 01234-567'],
    description: 'Venha nos visitar'
  },
  {
    icon: Clock,
    title: 'Horário',
    details: ['Segunda a Sexta: 8h às 18h', 'Sábado: 8h às 14h', 'Domingo: Fechado'],
    description: 'Funcionamento'
  }
];

export default function ContatoPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#003366] to-[#0093e9] py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fale Conosco
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-200 max-w-3xl mx-auto">
            Estamos aqui para ajudar! Entre em contato e receba atendimento personalizado para seu veículo.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <Section className="bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#0093e9]/10 to-[#1E90FF]/10 mb-4">
                    <IconComponent className="h-8 w-8 text-[#1E90FF]" />
                  </div>
                  <h3 className="font-bold text-[#003366] text-lg mb-2">
                    {info.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {info.description}
                  </p>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-700 font-medium text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ContactForm />
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-[#003366] mb-4 flex items-center">
                  <Navigation className="h-6 w-6 mr-2" />
                  Como Chegar
                </h3>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Mapa Interativo</p>
                    <p className="text-sm">Rua das Oficinas, 123 - São Paulo</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Estamos localizados em uma região de fácil acesso, com estacionamento próprio 
                  e próximo ao transporte público.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-[#003366] mb-4 flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  Atendimento Rápido
                </h3>
                <p className="text-gray-600 mb-4">
                  Para atendimento mais rápido, você também pode entrar em contato conosco via WhatsApp:
                </p>
                <a 
                  href="https://wa.me/5511999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 mr-2 inline" />
                  WhatsApp: (11) 99999-9999
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}