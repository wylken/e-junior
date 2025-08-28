import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const clientPassword = await bcrypt.hash('client123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@template.com' },
    update: {},
    create: {
      email: 'admin@template.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
      phone: '(11) 99999-9999',
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@template.com' },
    update: {},
    create: {
      email: 'client@template.com',
      name: 'Cliente Exemplo',
      password: clientPassword,
      role: 'CLIENT',
      phone: '(11) 88888-8888',
    },
  });

  const configurations = [
    {
      key: 'app_name',
      value: 'Template Base',
      type: 'TEXT',
      description: 'Nome da aplicação',
    },
    {
      key: 'webhook_url',
      value: 'https://api.exemplo.com/webhook',
      type: 'URL',
      description: 'URL do webhook principal',
    },
    {
      key: 'max_users',
      value: '100',
      type: 'NUMBER',
      description: 'Máximo de usuários permitidos',
    },
    {
      key: 'enable_notifications',
      value: 'true',
      type: 'BOOLEAN',
      description: 'Habilitar notificações',
    },
    {
      key: 'theme_config',
      value: JSON.stringify({
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
      }),
      type: 'JSON',
      description: 'Configurações do tema',
    },
  ];

  for (const config of configurations) {
    await prisma.configuration.upsert({
      where: { key: config.key },
      update: {},
      create: {
        key: config.key,
        value: config.value,
        type: config.type as any,
        description: config.description,
      },
    });
  }

  console.log('Seed concluído com sucesso!');
  console.log('Usuários criados:');
  console.log(`- Admin: ${admin.email} (senha: admin123)`);
  console.log(`- Cliente: ${client.email} (senha: client123)`);
  console.log(`Configurações criadas: ${configurations.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });