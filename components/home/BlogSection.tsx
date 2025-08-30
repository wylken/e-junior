import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, ArrowRight } from 'lucide-react';

const featuredPosts = [
  {
    id: 1,
    title: "Manutenção Preventiva: A Chave para um Carro Durável",
    excerpt: "Descubra como uma manutenção regular pode evitar grandes problemas e economizar dinheiro a longo prazo.",
    image: "https://images.pexels.com/photos/3807426/pexels-photo-3807426.jpeg",
    category: "Manutenção",
    date: "15 de Janeiro, 2025",
    slug: "manutencao-preventiva-chave-carro-duravel"
  },
  {
    id: 2,
    title: "Como Escolher as Peças Certas para seu Veículo",
    excerpt: "Orientações importantes para não errar na hora de comprar peças automotivas e garantir qualidade.",
    image: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg",
    category: "Peças",
    date: "12 de Janeiro, 2025",
    slug: "como-escolher-pecas-certas-veiculo"
  },
  {
    id: 3,
    title: "Sinais de que seu Freio Precisa de Atenção",
    excerpt: "Reconheça os sintomas que indicam problemas no sistema de freios e aja antes que seja tarde.",
    image: "https://images.pexels.com/photos/13065/pexels-photo-13065.jpeg",
    category: "Segurança",
    date: "10 de Janeiro, 2025",
    slug: "sinais-freio-precisa-atencao"
  }
];

export default function BlogSection() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#003366] sm:text-4xl lg:text-5xl">
            Últimas do Blog
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Dicas, novidades e informações importantes sobre o mundo automotivo
          </p>
        </div>
        
        <div className="mx-auto mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge 
                  className="absolute top-4 left-4 bg-gradient-to-r from-[#0093e9] to-[#1E90FF] text-white border-0"
                >
                  {post.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {post.date}
                </div>
                <h3 className="text-xl font-bold text-[#003366] group-hover:text-[#0093e9] transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <Button 
                  asChild 
                  variant="ghost" 
                  className="text-[#0093e9] hover:text-white hover:bg-gradient-to-r hover:from-[#0093e9] hover:to-[#1E90FF] transition-all duration-300 p-0"
                >
                  <Link href={`/blog/${post.slug}`} className="flex items-center">
                    Ler mais
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold px-8 py-3 transition-all duration-300"
          >
            <Link href="/blog">
              Ver Todos os Posts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}