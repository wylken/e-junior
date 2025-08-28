import { prisma } from '@/lib/db';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, generateSecureToken } from '@/lib/auth';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';
import { emailService } from '@/services/email';

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        phone: data.phone,
      }
    });

    const token = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      token,
      refreshToken,
    };
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new Error('Usuário desativado');
    }

    const isPasswordValid = await comparePassword(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const token = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      token,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token inválido ou expirado');
    }

    const newToken = await generateAccessToken({
      userId: storedToken.userId,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newRefreshToken = await generateRefreshToken({
      userId: storedToken.userId,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });
  }

  static async forgotPassword(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      // Por segurança, não revelamos se o usuário existe
      return true;
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
    return await emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new Error('Token de reset inválido ou expirado');
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new Error('Token de reset expirado');
    }

    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId },
    });

    if (!user || !user.isActive) {
      throw new Error('Usuário não encontrado ou inativo');
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);

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

    return true;
  }

  static async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    
    await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
  }
}