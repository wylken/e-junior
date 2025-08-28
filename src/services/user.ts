import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { User } from '@/types/auth';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'ADMIN' | 'CLIENT';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  photo?: string;
  role?: 'ADMIN' | 'CLIENT';
  isActive?: boolean;
}

export class UserService {
  static async getUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);

    return { users: users as User[], total };
  }

  static async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
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

    return user as User | null;
  }

  static async createUser(data: CreateUserData): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: data.role || 'CLIENT',
      },
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

    return user as User;
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('E-mail já está em uso');
      }
    }

    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
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

    return updatedUser as User;
  }

  static async deleteUser(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.refreshToken.deleteMany({
      where: { userId: id },
    });

    await prisma.user.delete({
      where: { id },
    });
  }

  static async toggleUserStatus(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
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

    return updatedUser as User;
  }
}