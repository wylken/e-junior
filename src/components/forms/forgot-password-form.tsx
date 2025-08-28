'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao processar solicitação');
      }

      setIsSuccess(true);
      toast.success('Instruções enviadas!', {
        description: 'Verifique seu email para redefinir a senha.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
      setError(errorMessage);
      toast.error('Erro ao enviar', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Email enviado com sucesso!</strong>
            <br />
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </AlertDescription>
        </Alert>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Enviamos as instruções para:
          </p>
          <p className="text-sm font-medium">{email}</p>
          <p className="text-xs text-muted-foreground">
            Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setIsSuccess(false);
            setError('');
          }}
          variant="outline" 
          className="w-full"
        >
          Enviar novamente
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-9"
            {...register('email')}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Enviar instruções
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Você receberá um email com o link para redefinir sua senha. 
          O link expira em 1 hora.
        </p>
      </div>
    </form>
  );
}