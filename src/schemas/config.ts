import { z } from 'zod';

export const configSchema = z.object({
  key: z.string()
    .min(1, 'Chave é obrigatória')
    .regex(/^[a-zA-Z0-9_]+$/, 'Chave deve conter apenas letras, números e underscore'),
  value: z.string().min(1, 'Valor é obrigatório'),
  type: z.enum(['URL', 'TEXT', 'NUMBER', 'BOOLEAN', 'JSON'], {
    required_error: 'Tipo é obrigatório',
  }),
  description: z.string().optional(),
}).refine((data) => {
  switch (data.type) {
    case 'URL':
      try {
        new URL(data.value);
        return true;
      } catch {
        return false;
      }
    case 'NUMBER':
      return !isNaN(Number(data.value));
    case 'BOOLEAN':
      return data.value === 'true' || data.value === 'false';
    case 'JSON':
      try {
        JSON.parse(data.value);
        return true;
      } catch {
        return false;
      }
    case 'TEXT':
      return true;
    default:
      return false;
  }
}, {
  message: 'Valor inválido para o tipo selecionado',
  path: ['value'],
});

export type ConfigInput = z.infer<typeof configSchema>;