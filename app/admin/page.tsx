'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, FileText, LogOut } from 'lucide-react';

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string;
}

export default function AdminPage() {
  const [form, setForm] = useState<PostForm>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  const categories = [
    'Manutenção',
    'Peças',
    'Dicas',
    'Novidades',
    'Serviços',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setMessage('Post criado com sucesso!');
        setForm({
          title: '',
          excerpt: '',
          content: '',
          image: '',
          category: '',
          tags: '',
        });
      } else {
        const error = await response.json();
        setMessage(`Erro: ${error.error}`);
      }
    } catch (error) {
      setMessage('Erro ao criar post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof PostForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold gradient-text-primary mb-4">
                Área Administrativa
              </h1>
              <p className="text-lg text-gray-600">
                Bem-vindo, {user?.username}! Gerencie o conteúdo do blog da JUNIOR Oficina
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/80">
          <CardHeader className="gradient-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <PlusCircle className="h-6 w-6" />
              Criar Novo Post
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Título *
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Digite o título do post"
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Categoria *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                  Resumo
                </Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Breve descrição do post"
                  rows={3}
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                  URL da Imagem
                </Label>
                <Input
                  id="image"
                  value={form.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500">Separe as tags com vírgulas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                  Conteúdo *
                </Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Escreva o conteúdo completo do post aqui..."
                  rows={12}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('sucesso') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-primary text-white font-semibold py-3 transition-all duration-300 hover-lift"
              >
                {isSubmitting ? (
                  'Criando Post...'
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Criar Post
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}