import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/schemas/auth';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Buscar token de reset
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({
        success: false,
        message: 'Token de reset inválido ou expirado.',
      }, { status: 400 });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuário não encontrado.',
      }, { status: 400 });
    }

    // Verificar se o token não expirou
    if (new Date() > resetToken.expiresAt) {
      // Remover token expirado
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json({
        success: false,
        message: 'Token de reset expirado. Solicite um novo reset de senha.',
      }, { status: 400 });
    }

    // Verificar se o usuário ainda está ativo
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Usuário inativo. Entre em contato com o suporte.',
      }, { status: 400 });
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(password);

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Remover token usado
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // Remover todos os refresh tokens do usuário (forçar novo login)
    await prisma.refreshToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso. Faça login com sua nova senha.',
    });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
    }, { status: 500 });
  }
}