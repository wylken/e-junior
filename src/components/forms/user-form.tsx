'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, updateUserSchema, CreateUserInput, UpdateUserInput } from '@/schemas/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types/auth';
import Link from 'next/link';

interface UserFormProps {
  user?: User;
  isEdit?: boolean;
  userRole: 'ADMIN' | 'CLIENT';
}

export function UserForm({ user, isEdit = false, userRole }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const schema = isEdit ? updateUserSchema : createUserSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(schema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive,
    } : {
      role: 'CLIENT',
      isActive: true,
    },
  });

  const watchedRole = watch('role' as any);
  const watchedIsActive = watch('isActive' as any);

  useEffect(() => {
    if (user && isEdit) {
      setValue('name' as any, user.name);
      setValue('email' as any, user.email);
      setValue('phone' as any, user.phone || '');
      setValue('role' as any, user.role);
      setValue('isActive' as any, user.isActive);
    }
  }, [user, isEdit, setValue]);

  const onSubmit = async (data: CreateUserInput | UpdateUserInput) => {
    setIsLoading(true);
    try {
      const url = isEdit ? `/api/users/${user?.id}` : '/api/users';
      const method = isEdit ? 'PUT' : 'POST';

      const submitData = { ...data };
      if (isEdit && !(submitData as UpdateUserInput).password) {
        delete (submitData as UpdateUserInput).password;
        delete (submitData as UpdateUserInput).confirmPassword;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao ${isEdit ? 'atualizar' : 'criar'} usuário`);
      }

      const result = await response.json();
      toast.success(result.message);
      router.push('/users');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Erro ao ${isEdit ? 'atualizar' : 'criar'} usuário`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full space-y-6 flex flex-col">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Usuário' : 'Novo Usuário'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Modifique os dados do usuário' : 'Preencha os dados para criar um novo usuário'}
          </p>
        </div>
      </div>

      <Card className="w-full max-w-4xl flex-1">
        <CardHeader>
          <CardTitle>
            {isEdit ? 'Dados do Usuário' : 'Informações do Usuário'}
          </CardTitle>
          <CardDescription>
            {isEdit 
              ? 'Altere as informações necessárias e clique em salvar'
              : 'Preencha todos os campos obrigatórios'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 h-full flex flex-col">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  {...register('name' as any)}
                  placeholder="Nome completo do usuário"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email' as any)}
                  placeholder="email@exemplo.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone' as any)}
                  placeholder="(11) 99999-9999"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {userRole === 'ADMIN' && (
                <div className="space-y-2">
                  <Label htmlFor="role">Perfil *</Label>
                  <Select 
                    value={watchedRole} 
                    onValueChange={(value) => setValue('role' as any, value as any)}
                  >
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Cliente</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Seção de senha */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                {isEdit ? 'Alterar Senha' : 'Definir Senha'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {isEdit ? 'Nova senha (deixe em branco para manter a atual)' : 'Senha *'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password' as any)}
                      placeholder={isEdit ? 'Digite uma nova senha' : 'Digite a senha'}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {isEdit ? 'Confirmar nova senha' : 'Confirmar senha *'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword' as any)}
                      placeholder={isEdit ? 'Confirme a nova senha' : 'Confirme a senha'}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Configurações adicionais */}
            {userRole === 'ADMIN' && isEdit && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Configurações
                </h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={watchedIsActive}
                    onCheckedChange={(checked) => setValue('isActive' as any, checked)}
                  />
                  <Label htmlFor="isActive">Usuário ativo</Label>
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-4 pt-6 border-t mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/users')}
                disabled={isLoading}
                className="flex-1 md:flex-none"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 md:flex-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? 'Salvando...' : 'Criando...'}
                  </>
                ) : (
                  isEdit ? 'Salvar alterações' : 'Criar usuário'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}