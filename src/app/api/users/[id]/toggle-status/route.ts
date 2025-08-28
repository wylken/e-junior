import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user';
import { verifyAccessToken } from '@/lib/auth';

export async function PATCH(
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
        { error: 'Você não pode alterar seu próprio status' },
        { status: 400 }
      );
    }

    const user = await UserService.toggleUserStatus(id);

    return NextResponse.json({
      message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso`,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}