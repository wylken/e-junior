import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, ArrowLeft, Share2, User } from 'lucide-react';
import { notFound } from 'next/navigation';

// Mock data for blog post - in real app, this would come from database
const getBlogPost = async (slug: string) => {
  const posts = {
    'manutencao-preventiva-chave-carro-duravel': {
      id: 1,
      title: "Manutenção Preventiva: A Chave para um Carro Durável",
      content: `
        <p>A manutenção preventiva é fundamental para garantir a longevidade do seu veículo e evitar surpresas desagradáveis no trânsito. Muitos proprietários só procuram uma oficina quando algo já deu errado, mas essa abordagem pode resultar em gastos muito maiores a longo prazo.</p>
        
        <h2>O que é Manutenção Preventiva?</h2>
        <p>A manutenção preventiva consiste em realizar verificações e substituições de peças e fluidos antes que apresentem problemas. É como fazer um check-up médico regularmente - você identifica e resolve pequenos problemas antes que se tornem grandes dores de cabeça.</p>
        
        <h2>Principais Itens da Manutenção Preventiva</h2>
        <ul>
          <li><strong>Troca de óleo do motor:</strong> Deve ser feita conforme especificação do fabricante</li>
          <li><strong>Filtros:</strong> Ar, combustível e óleo precisam ser verificados regularmente</li>
          <li><strong>Fluidos:</strong> Freio, direção hidráulica, arrefecimento</li>
          <li><strong>Pneus:</strong> Calibragem e verificação do desgaste</li>
          <li><strong>Sistema elétrico:</strong> Bateria, alternador e velas</li>
        </ul>
        
        <h2>Benefícios da Manutenção Preventiva</h2>
        <p>Além da economia financeira, a manutenção preventiva garante maior segurança no trânsito, melhor performance do veículo e preserva o valor de revenda. Um carro bem cuidado tem vida útil muito maior e apresenta menos problemas inesperados.</p>
        
        <p>Na JUNIOR Peças e Serviços, oferecemos planos de manutenção preventiva personalizados para cada tipo de veículo e uso. Nossa equipe especializada fará uma avaliação completa e criará um cronograma ideal para manter seu carro sempre em perfeitas condições.</p>
      `,
      image: "https://images.pexels.com/photos/3807426/pexels-photo-3807426.jpeg",
      category: "Manutenção",
      date: "15 de Janeiro, 2025",
      author: "JUNIOR Oficina",
      readTime: "5 min"
    }
  };
  
  return posts[slug as keyof typeof posts] || null;
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0">
          <Image 
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/80 to-[#0093e9]/60"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8">
          <Badge className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] text-white border-0 mb-6">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center text-gray-200 space-x-6 mb-8">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2" />
              {post.date}
            </div>
            <span>{post.readTime} de leitura</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              asChild 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#003366] transition-all duration-300"
            >
              <Link href="/blog" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Blog
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#003366] transition-all duration-300"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <Section className="bg-white">
        <div className="mx-auto max-w-4xl">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-[#003366] prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Precisa de Ajuda com seu Veículo?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe especializada está pronta para cuidar do seu carro com toda a qualidade e profissionalismo.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold px-8 py-3 transition-all duration-300"
          >
            <Link href="/contato">
              Solicitar Orçamento
            </Link>
          </Button>
        </div>
      </Section>

      <Footer />
    </main>
  );
}