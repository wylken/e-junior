# Template Base - Sistema de Autenticação e Gerenciamento

Um template completo e robusto desenvolvido com Next.js 15, TypeScript, Prisma e Shadcn/UI, fornecendo um sistema de autenticação JWT completo, gerenciamento de usuários e sistema de configurações dinâmicas.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação Completo
- **Login/Registro** com validação completa
- **JWT** com refresh token
- **Middleware** de proteção de rotas
- **Recuperação de senha** (estrutura pronta)
- **Logout** seguro

### ✅ Gerenciamento de Usuários
- **CRUD completo** de usuários
- **Sistema de roles** (Admin/Cliente)
- **Controle de permissões** por perfil
- **Ativação/desativação** de usuários
- **Upload de foto** de perfil (estrutura pronta)
- **Página de perfil** individual

### ✅ Sistema de Configurações Dinâmicas
- **CRUD de configurações** com tipos validados
- **Suporte a múltiplos tipos**: URL, TEXT, NUMBER, BOOLEAN, JSON
- **Interface administrativa** completa
- **Validação de tipos** em tempo real

### ✅ Interface Moderna
- **Layout responsivo** com sidebar retrátil
- **Sistema de temas** claro/escuro
- **Componentes Shadcn/UI** + Aceternity UI
- **Notificações** com Sonner
- **Design system** consistente

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15.3.5 (App Router)
- **Linguagem**: TypeScript (strict mode)
- **Banco de Dados**: SQLite (Prisma ORM)
- **Autenticação**: JWT com Jose
- **UI**: Shadcn/UI + Aceternity UI
- **Estilização**: Tailwind CSS
- **Formulários**: React Hook Form + Zod
- **Validação**: Zod schemas
- **Hash de Senhas**: bcryptjs

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clone e instale dependências
```bash
git clone <seu-repositorio>
cd usuario_base_shadcnui
npm install
```

### 2. Configure variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="sua-chave-secreta-jwt"
JWT_REFRESH_SECRET="sua-chave-secreta-refresh"

# Email (para recuperação de senha)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASSWORD="sua-senha-app"

# Upload de arquivos
UPLOAD_FOLDER="./uploads"
MAX_FILE_SIZE="5242880"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Template Base"
```

### 3. Configure o banco de dados
```bash
# Aplicar migrações
npm run db:migrate

# Popular com dados iniciais
npm run db:seed
```

### 4. Inicie o servidor
```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 👥 Usuários Padrão

Após executar o seed, você terá:

**Administrador:**
- Email: `admin@template.com`
- Senha: `admin123`

**Cliente:**
- Email: `client@template.com`
- Senha: `client123`

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rotas autenticadas
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── users/         # Gerenciamento de usuários
│   │   ├── settings/      # Configurações do sistema
│   │   └── profile/       # Perfil do usuário
│   ├── (public)/          # Rotas públicas
│   │   ├── login/         # Página de login
│   │   ├── register/      # Página de registro
│   │   └── forgot-password/
│   └── api/               # API Routes
│       ├── auth/          # Endpoints de autenticação
│       ├── users/         # Endpoints de usuários
│       └── config/        # Endpoints de configuração
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Shadcn)
│   ├── forms/            # Formulários específicos
│   └── layout/           # Componentes de layout
├── lib/                  # Utilitários e configurações
├── services/             # Lógica de negócio
├── hooks/                # Custom hooks
├── types/                # TypeScript types
├── schemas/              # Schemas Zod
└── middleware.ts         # Middleware Next.js
```

## 🔐 Sistema de Permissões

### Roles Disponíveis
- **ADMIN**: Acesso total ao sistema
- **CLIENT**: Acesso limitado (dashboard e perfil)

### Proteção de Rotas
- **Middleware automático** protege rotas autenticadas
- **Verificação de roles** nas APIs
- **Componentes protegidos** por permissão

## 📊 Configurações Dinâmicas

O sistema suporta 5 tipos de configuração:

1. **TEXT**: Texto simples
2. **NUMBER**: Valores numéricos
3. **BOOLEAN**: true/false
4. **URL**: URLs válidas
5. **JSON**: Objetos JSON complexos

### Exemplos de Uso
```typescript
// Buscar configuração
const config = await ConfigService.getConfigurationByKey('app_name');

// Validar e formatar valor
const formattedValue = ConfigService.formatConfigValue(config.value, config.type);
```

## 🎨 Customização de Tema

O projeto suporta temas claro/escuro:

```typescript
// Usar o hook de tema
const { theme, setTheme } = useTheme();

// Alternar tema
setTheme(theme === 'dark' ? 'light' : 'dark');
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting

# Banco de dados
npm run db:push      # Sincroniza schema com banco
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula banco com dados iniciais
npm run db:studio    # Abre Prisma Studio
```

## 🔧 Desenvolvimento

### Adicionar Nova Funcionalidade

1. **Criar model no Prisma** (se necessário):
```prisma
model NovoModel {
  id        String   @id @default(cuid())
  // campos...
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. **Criar service** em `src/services/`
3. **Criar APIs** em `src/app/api/`
4. **Criar schemas Zod** em `src/schemas/`
5. **Criar componentes** em `src/components/`
6. **Criar páginas** em `src/app/`

### Padrões de Código

- **TypeScript strict mode** ativado
- **Sem uso de `any`**
- **Validação Zod** em todas as APIs
- **Tratamento de erros** consistente
- **Componentes pequenos** e reutilizáveis

## 🔒 Segurança

- **Senhas** hasheadas com bcrypt
- **JWT** com expiração (15min + refresh 7d)
- **Validação** de entrada em todas as APIs
- **Middleware** de proteção automática
- **Cookies httpOnly** para tokens

## 🌐 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build da imagem
docker build -t template-base .

# Executar container
docker run -p 3000:3000 template-base
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de TOKEN não encontrado**:
   - Verifique se as variáveis JWT_SECRET estão configuradas
   - Faça logout e login novamente

2. **Erro de banco de dados**:
   - Execute `npm run db:migrate`
   - Verifique se DATABASE_URL está correto

3. **Erro de permissão**:
   - Verifique se o usuário tem o role correto
   - Confirme se está logado como admin para acessar /users

## 📚 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Shadcn](https://ui.shadcn.com) pelos componentes UI
- [Aceternity UI](https://ui.aceternity.com) pelos componentes extras
- [Next.js Team](https://nextjs.org) pelo framework
- [Prisma Team](https://prisma.io) pelo ORM

---

**Desenvolvido com ❤️ usando Next.js + TypeScript + Prisma**