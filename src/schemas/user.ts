import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'CLIENT']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  confirmPassword: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'CLIENT']).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => {
  if (data.password && !data.confirmPassword) {
    return false;
  }
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password && !data.confirmPassword) {
    return false;
  }
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  if (data.password && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Para alterar a senha, confirme a senha atual e a nova senha',
  path: ['confirmPassword'],
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;