import { NextRequest, NextResponse } from 'next/server';
import { ConfigService } from '@/services/config';
import { verifyAccessToken } from '@/lib/auth';
import { z } from 'zod';

const createConfigSchema = z.object({
  key: z.string().min(1, 'Chave é obrigatória').regex(/^[a-zA-Z0-9_]+$/, 'Chave deve conter apenas letras, números e underscore'),
  value: z.string().min(1, 'Valor é obrigatório'),
  type: z.enum(['URL', 'TEXT', 'NUMBER', 'BOOLEAN', 'JSON']),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const configurations = await ConfigService.getConfigurations();

    return NextResponse.json({ configurations });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createConfigSchema.parse(body);

    if (!ConfigService.validateConfigValue(validatedData.value, validatedData.type)) {
      return NextResponse.json(
        { error: `Valor inválido para o tipo ${validatedData.type}` },
        { status: 400 }
      );
    }

    const configuration = await ConfigService.createConfiguration(validatedData);

    return NextResponse.json(
      { message: 'Configuração criada com sucesso', configuration },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}