import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedData = contactSchema.parse(body);
    
    // Save to database
    const contact = await prisma.contact.create({
      data: validatedData,
    });
    
    return NextResponse.json(
      { message: 'Contato enviado com sucesso!', id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}