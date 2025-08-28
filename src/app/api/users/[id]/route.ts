import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user';
import { verifyAccessToken } from '@/lib/auth';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  phone: z.string().optional(),
  photo: z.string().optional(),
  role: z.enum(['ADMIN', 'CLIENT']).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (payload.role !== 'ADMIN' && payload.userId !== id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const user = await UserService.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (payload.role !== 'ADMIN' && payload.userId !== id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    if (payload.role !== 'ADMIN') {
      delete validatedData.role;
      delete validatedData.isActive;
    }

    const user = await UserService.updateUser(id, validatedData);

    return NextResponse.json(
      { message: 'Usuário atualizado com sucesso', user }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    if (payload.userId === id) {
      return NextResponse.json(
        { error: 'Você não pode deletar seu próprio usuário' },
        { status: 400 }
      );
    }

    await UserService.deleteUser(id);

    return NextResponse.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}