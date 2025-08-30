import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const blogPosts = [
  {
    id: 1,
    title: "Manutenção Preventiva: A Chave para um Carro Durável",
    excerpt: "Descubra como uma manutenção regular pode evitar grandes problemas e economizar dinheiro a longo prazo.",
    image: "https://images.pexels.com/photos/3807426/pexels-photo-3807426.jpeg",
    category: "Manutenção",
    date: "15 de Janeiro, 2025",
    slug: "manutencao-preventiva-chave-carro-duravel",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Como Escolher as Peças Certas para seu Veículo",
    excerpt: "Orientações importantes para não errar na hora de comprar peças automotivas e garantir qualidade.",
    image: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg",
    category: "Peças",
    date: "12 de Janeiro, 2025",
    slug: "como-escolher-pecas-certas-veiculo",
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Sinais de que seu Freio Precisa de Atenção",
    excerpt: "Reconheça os sintomas que indicam problemas no sistema de freios e aja antes que seja tarde.",
    image: "https://images.pexels.com/photos/13065/pexels-photo-13065.jpeg",
    category: "Segurança",
    date: "10 de Janeiro, 2025",
    slug: "sinais-freio-precisa-atencao",
    readTime: "4 min"
  },
  {
    id: 4,
    title: "Preparando seu Carro para o Inverno",
    excerpt: "Dicas essenciais para manter seu veículo funcionando perfeitamente durante os meses mais frios.",
    image: "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg",
    category: "Sazonais",
    date: "8 de Janeiro, 2025",
    slug: "preparando-carro-inverno",
    readTime: "6 min"
  },
  {
    id: 5,
    title: "A Importância da Troca do Óleo no Prazo",
    excerpt: "Entenda por que respeitar o intervalo de troca de óleo é fundamental para a saúde do motor.",
    image: "https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg",
    category: "Manutenção",
    date: "5 de Janeiro, 2025",
    slug: "importancia-troca-oleo-prazo",
    readTime: "5 min"
  },
  {
    id: 6,
    title: "Como Identificar Problemas na Suspensão",
    excerpt: "Sinais que seu carro apresenta quando a suspensão não está funcionando adequadamente.",
    image: "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg",
    category: "Suspensão",
    date: "3 de Janeiro, 2025",
    slug: "identificar-problemas-suspensao",
    readTime: "8 min"
  }
];

const categories = ['Todos', 'Manutenção', 'Peças', 'Segurança', 'Sazonais', 'Suspensão'];

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#003366] to-[#0093e9] py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Blog Automotivo
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-200 max-w-3xl mx-auto">
            Dicas, novidades e informações especializadas para manter seu veículo sempre em perfeitas condições.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <Section className="bg-white pt-8 pb-0">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Pesquisar artigos..."
              className="pl-10 border-gray-300 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'Todos' ? 'default' : 'outline'}
                size="sm"
                className={category === 'Todos' 
                  ? 'bg-gradient-to-r from-[#0093e9] to-[#1E90FF] text-white border-0' 
                  : 'border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white'
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </Section>

      {/* Blog Grid */}
      <Section className="bg-white pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
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
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {post.date}
                  </div>
                  <span>{post.readTime}</span>
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
                    Ler artigo completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Newsletter */}
      <Section className="bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Receba Nossas Dicas por Email
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Cadastre-se em nossa newsletter e receba dicas exclusivas sobre manutenção automotiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              placeholder="Seu melhor email"
              className="border-gray-300 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
            />
            <Button 
              className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold px-6 transition-all duration-300"
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}