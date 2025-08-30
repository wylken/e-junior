import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromRequest } from './auth';

export function withAuth(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any) => {
    try {
      const token = extractTokenFromRequest(request);
      
      if (!token) {
        return NextResponse.json(
          { error: 'Token de autorização necessário' },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Token inválido ou expirado' },
          { status: 401 }
        );
      }

      // Adicionar informações do usuário ao request
      (request as any).user = payload;

      return handler(request, context);
    } catch (error) {
      return NextResponse.json(
        { error: 'Erro de autenticação' },
        { status: 401 }
      );
    }
  };
}