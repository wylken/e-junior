import { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Redefinir Senha',
  description: 'Crie uma nova senha para sua conta',
};

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            {process.env.NEXT_PUBLIC_APP_NAME || 'Sistema'}
          </div>
        </div>
        
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Token Inválido</CardTitle>
                <CardDescription>
                  O link de redefinição de senha é inválido ou expirado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  O token de redefinição não foi encontrado na URL. Verifique se você acessou o link correto recebido por email.
                </p>
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/forgot-password"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Solicitar novo link
                  </Link>
                  <Link 
                    href="/login"
                    className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          {process.env.NEXT_PUBLIC_APP_NAME || 'Sistema'}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Defina uma nova senha forte para manter sua conta segura.&rdquo;
            </p>
            <footer className="text-sm">Sistema de Autenticação</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Redefinir Senha
            </h1>
            <p className="text-sm text-muted-foreground">
              Crie uma nova senha para sua conta
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Nova Senha</CardTitle>
              <CardDescription>
                Sua nova senha deve ter pelo menos 6 caracteres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm token={token} />
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Link 
              href="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}