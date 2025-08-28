import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, comparePassword, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
}).refine((data) => {
  if (data.password && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Para alterar a senha, informe a senha atual',
  path: ['currentPassword'],
});

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'E-mail já está em uso' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
    };

    if (validatedData.password && validatedData.currentPassword) {
      const isCurrentPasswordValid = await comparePassword(
        validatedData.currentPassword, 
        user.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Senha atual incorreta' },
          { status: 400 }
        );
      }

      updateData.password = await hashPassword(validatedData.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        photo: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser,
    });
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