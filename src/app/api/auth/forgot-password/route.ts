import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/schemas/auth';
import { prisma } from '@/lib/db';
import { emailService } from '@/services/email';
import { generateSecureToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por segurança, não revelamos se o email existe ou não
      return NextResponse.json({
        success: true,
        message: 'Se o email existir em nossa base, você receberá as instruções para redefinir sua senha.',
      });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Usuário inativo. Entre em contato com o suporte.',
      }, { status: 400 });
    }

    // Gerar token de reset
    const resetToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Limpar tokens antigos do usuário
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Criar novo token de reset
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Enviar email de reset
    const emailSent = await emailService.sendPasswordResetEmail(user.email, resetToken);

    if (!emailSent) {
      // Limpar token se não conseguiu enviar email
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      return NextResponse.json({
        success: false,
        message: 'Erro ao enviar email. Tente novamente mais tarde.',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Se o email existir em nossa base, você receberá as instruções para redefinir sua senha.',
    });

  } catch (error) {
    console.error('Erro ao processar solicitação de reset:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
    }, { status: 500 });
  }
}