'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
    },
  });

  const password = watch('password');

  async function onSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao redefinir senha');
      }

      setIsSuccess(true);
      toast.success('Senha redefinida!', {
        description: 'Sua senha foi alterada com sucesso.',
      });

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
      setError(errorMessage);
      toast.error('Erro ao redefinir senha', {
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
            <strong>Senha redefinida com sucesso!</strong>
            <br />
            Você será redirecionado para o login em alguns segundos.
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
          </p>
        </div>
        
        <Button 
          onClick={() => router.push('/login')}
          className="w-full"
        >
          Ir para o login
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

      <input type="hidden" {...register('token')} />

      <div className="space-y-2">
        <Label htmlFor="password">Nova Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sua nova senha"
            className="pl-9 pr-9"
            {...register('password')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirme sua nova senha"
            className="pl-9 pr-9"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {password && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Força da senha:</Label>
          <div className="space-y-1">
            <div className="flex space-x-1">
              <div className={`h-1 w-1/4 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 w-1/4 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 w-1/4 rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 w-1/4 rounded ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
            </div>
            <p className="text-xs text-muted-foreground">
              Use pelo menos 6 caracteres com letras e números
            </p>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redefinindo...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Redefinir senha
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Após redefinir sua senha, você precisará fazer login novamente.
        </p>
      </div>
    </form>
  );
}