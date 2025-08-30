import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar usuário admin
  const existingUser = await prisma.user.findUnique({
    where: { username: 'wylken' }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('612020', 12);
    
    const user = await prisma.user.create({
      data: {
        username: 'wylken',
        password: hashedPassword,
      },
    });

    console.log('✅ Usuário criado:', user.username);
  } else {
    console.log('⚠️ Usuário já existe:', existingUser.username);
  }

  console.log('🌱 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });