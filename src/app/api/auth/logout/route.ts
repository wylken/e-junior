import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    const response = NextResponse.json(
      { message: 'Logout realizado com sucesso' },
      { status: 200 }
    );

    response.cookies.delete('token');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
}