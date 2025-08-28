# Guia de Gerenciamento de Perfis e Recursos do Sistema

## 📋 Visão Geral

Este guia explica como adicionar novos perfis (roles) ao sistema e como definir quais recursos cada perfil pode acessar. O sistema atual utiliza um modelo de autenticação baseado em JWT com controle de acesso por roles.

## 🔧 Estrutura Atual de Perfis

### Perfis Existentes

O sistema atualmente possui 2 perfis definidos:

- **ADMIN**: Administrador com acesso total
- **CLIENT**: Cliente com acesso limitado

### Localização dos Perfis

**Arquivo: `prisma/schema.prisma`**
```prisma
enum Role {
  ADMIN
  CLIENT
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  phone     String?
  photo     String?
  role      Role     @default(CLIENT)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🆕 Como Adicionar Novos Perfis

### Passo 1: Atualizar o Schema do Banco

1. **Edite o arquivo `prisma/schema.prisma`:**

```prisma
enum Role {
  ADMIN
  CLIENT
  MANAGER      // Novo perfil
  MODERATOR    // Novo perfil
  VIEWER       // Novo perfil
}
```

### Passo 2: Executar Migração do Banco

```bash
npx prisma migrate dev --name add-new-roles
```

### Passo 3: Atualizar Tipos TypeScript

1. **Edite o arquivo `src/types/auth.ts`:**

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
  role: 'ADMIN' | 'CLIENT' | 'MANAGER' | 'MODERATOR' | 'VIEWER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'MANAGER' | 'MODERATOR' | 'VIEWER';
  iat: number;
  exp: number;
}
```

### Passo 4: Atualizar Esquemas de Validação

1. **Edite o arquivo `src/schemas/user.ts`:**

```typescript
export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'CLIENT', 'MANAGER', 'MODERATOR', 'VIEWER']).optional(),
});
```

### Passo 5: Criar Seeds para Novos Perfis

1. **Atualize o arquivo `prisma/seed.ts`:**

```typescript
const manager = await prisma.user.upsert({
  where: { email: 'manager@template.com' },
  update: {},
  create: {
    email: 'manager@template.com',
    name: 'Gerente',
    password: managerPassword,
    role: 'MANAGER',
    phone: '(11) 77777-7777',
  },
});

const moderator = await prisma.user.upsert({
  where: { email: 'moderator@template.com' },
  update: {},
  create: {
    email: 'moderator@template.com',
    name: 'Moderador',
    password: moderatorPassword,
    role: 'MODERATOR',
    phone: '(11) 66666-6666',
  },
});
```

## 🔐 Como Definir Recursos por Perfil

### Estrutura de Controle de Acesso

O sistema controla o acesso em **4 níveis**:

1. **Middleware** (`src/middleware.ts`)
2. **APIs** (`src/app/api/`)
3. **Interface** (`src/components/layout/sidebar.tsx`)
4. **Páginas** (`src/app/(auth)/`)

### Configurando Acesso ao Menu

**Arquivo: `src/components/layout/sidebar.tsx`**

```typescript
export function Sidebar({ userRole, onLogout, isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['ADMIN', 'CLIENT', 'MANAGER', 'MODERATOR', 'VIEWER'], // Todos podem acessar
    },
    {
      title: 'Usuários',
      href: '/users',
      icon: Users,
      roles: ['ADMIN', 'MANAGER'], // Apenas ADMIN e MANAGER
    },
    {
      title: 'Configurações',
      href: '/settings',
      icon: Settings,
      roles: ['ADMIN'], // Apenas ADMIN
    },
    {
      title: 'Relatórios',
      href: '/reports',
      icon: FileText,
      roles: ['ADMIN', 'MANAGER', 'MODERATOR'], // Novo recurso
    },
    {
      title: 'Perfil',
      href: '/profile',
      icon: User,
      roles: ['ADMIN', 'CLIENT', 'MANAGER', 'MODERATOR', 'VIEWER'], // Todos
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  // Resto do código...
}
```

### Protegendo Rotas no Middleware

**Arquivo: `src/middleware.ts`**

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await verifyAccessToken(token);
    
    // Controle de acesso baseado em roles
    if (pathname.startsWith('/users')) {
      if (!['ADMIN', 'MANAGER'].includes(payload.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    if (pathname.startsWith('/settings')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    if (pathname.startsWith('/reports')) {
      if (!['ADMIN', 'MANAGER', 'MODERATOR'].includes(payload.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### Protegendo APIs

**Exemplo: `src/app/api/users/route.ts`**

```typescript
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    
    // Controle de acesso por múltiplos perfis
    if (!['ADMIN', 'MANAGER'].includes(payload.role)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const result = await UserService.getUsers(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
```

### Controle Granular de Operações

**Exemplo: Diferentes níveis de acesso para diferentes operações**

```typescript
// API de usuários com controle granular
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await verifyAccessToken(token);
    const { id } = await params;
    const body = await request.json();

    // Validação de acesso
    if (payload.role === 'ADMIN') {
      // ADMIN pode alterar tudo
      const validatedData = updateUserSchema.parse(body);
    } else if (payload.role === 'MANAGER') {
      // MANAGER pode alterar dados básicos, mas não role de ADMIN
      const validatedData = updateUserSchema.parse(body);
      
      // Verifica se está tentando alterar um ADMIN
      const targetUser = await UserService.getUserById(id);
      if (targetUser.role === 'ADMIN') {
        return NextResponse.json({ error: 'Não é possível alterar dados de administrador' }, { status: 403 });
      }
      
      // MANAGER não pode definir role ADMIN
      if (validatedData.role === 'ADMIN') {
        return NextResponse.json({ error: 'Não é possível definir role ADMIN' }, { status: 403 });
      }
    } else if (payload.role === 'MODERATOR') {
      // MODERATOR pode alterar apenas alguns campos
      const validatedData = updateUserSchema.parse(body);
      delete validatedData.role; // Remove role
      delete validatedData.isActive; // Remove isActive
    } else {
      // Outros perfis só podem alterar seus próprios dados
      if (payload.userId !== id) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
      }
      
      const validatedData = updateUserSchema.parse(body);
      delete validatedData.role; // Remove role
      delete validatedData.isActive; // Remove isActive
    }

    const user = await UserService.updateUser(id, validatedData);
    return NextResponse.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
```

## 📊 Matriz de Permissões Sugerida

### Recursos vs Perfis

| Recurso | ADMIN | MANAGER | MODERATOR | CLIENT | VIEWER |
|---------|-------|---------|-----------|--------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Usuários - Listar | ✅ | ✅ | ✅ | ❌ | ❌ |
| Usuários - Criar | ✅ | ✅ | ❌ | ❌ | ❌ |
| Usuários - Editar | ✅ | ✅ | ❌ | ❌ | ❌ |
| Usuários - Deletar | ✅ | ❌ | ❌ | ❌ | ❌ |
| Configurações | ✅ | ❌ | ❌ | ❌ | ❌ |
| Relatórios | ✅ | ✅ | ✅ | ❌ | ❌ |
| Perfil | ✅ | ✅ | ✅ | ✅ | ✅ |

### Operações Especiais

- **ADMIN**: Acesso total, pode alterar qualquer usuário
- **MANAGER**: Pode gerenciar usuários, mas não outros ADMINs
- **MODERATOR**: Pode visualizar e moderar conteúdo
- **CLIENT**: Acesso limitado, pode apenas ver dashboard e perfil
- **VIEWER**: Apenas visualização, sem operações de escrita

## 🛠️ Implementação de Novos Recursos

### 1. Criar Nova Página/Rota

```typescript
// src/app/(auth)/reports/page.tsx
import { useAuth } from '@/hooks/use-auth';

export default function ReportsPage() {
  const { user } = useAuth();
  
  // Verificação adicional no frontend
  if (!user || !['ADMIN', 'MANAGER', 'MODERATOR'].includes(user.role)) {
    return <div>Acesso negado</div>;
  }

  return (
    <div>
      <h1>Relatórios</h1>
      {/* Conteúdo da página */}
    </div>
  );
}
```

### 2. Criar API para o Recurso

```typescript
// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    
    if (!['ADMIN', 'MANAGER', 'MODERATOR'].includes(payload.role)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Lógica para buscar relatórios
    const reports = await getReports();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
```

### 3. Atualizar Middleware

```typescript
// src/middleware.ts
if (pathname.startsWith('/reports')) {
  if (!['ADMIN', 'MANAGER', 'MODERATOR'].includes(payload.role)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

### 4. Adicionar ao Menu

```typescript
// src/components/layout/sidebar.tsx
{
  title: 'Relatórios',
  href: '/reports',
  icon: FileText,
  roles: ['ADMIN', 'MANAGER', 'MODERATOR'],
}
```

## 🔍 Componente de Proteção de Recursos

### Hook para Verificar Permissões

```typescript
// src/hooks/use-permissions.ts
import { useAuth } from './use-auth';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const canManageUsers = () => hasPermission(['ADMIN', 'MANAGER']);
  const canViewReports = () => hasPermission(['ADMIN', 'MANAGER', 'MODERATOR']);
  const canManageSettings = () => hasPermission(['ADMIN']);

  return {
    hasPermission,
    canManageUsers,
    canViewReports,
    canManageSettings,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    isModerator: user?.role === 'MODERATOR',
  };
}
```

### Componente de Proteção

```typescript
// src/components/auth/permission-guard.tsx
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGuardProps {
  requiredRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ requiredRoles, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(requiredRoles)) {
    return fallback;
  }

  return <>{children}</>;
}
```

### Uso do Componente

```typescript
// Exemplo de uso
<PermissionGuard requiredRoles={['ADMIN', 'MANAGER']}>
  <UserManagementSection />
</PermissionGuard>

<PermissionGuard 
  requiredRoles={['ADMIN']} 
  fallback={<div>Você não tem permissão para ver esta seção</div>}
>
  <AdminOnlySection />
</PermissionGuard>
```

## 🚀 Executando as Alterações

### 1. Atualizar Banco de Dados

```bash
# Gerar migração
npx prisma migrate dev --name add-new-roles

# Atualizar seed
npm run db:seed
```

### 2. Regenerar Cliente Prisma

```bash
npx prisma generate
```

### 3. Testar Implementação

```bash
# Executar em desenvolvimento
npm run dev

# Executar testes (se houver)
npm run test
```

## 📋 Checklist de Implementação

### Para Cada Novo Perfil:

- [ ] Adicionar ao enum `Role` no schema.prisma
- [ ] Executar migração do banco
- [ ] Atualizar tipos TypeScript
- [ ] Atualizar esquemas de validação
- [ ] Criar seeds para teste
- [ ] Definir permissões no middleware
- [ ] Configurar acesso ao menu
- [ ] Testar todas as funcionalidades

### Para Cada Novo Recurso:

- [ ] Criar página/componente
- [ ] Implementar API
- [ ] Proteger no middleware
- [ ] Adicionar ao menu (se necessário)
- [ ] Implementar validações
- [ ] Testar permissões
- [ ] Documentar funcionalidade

## 🔧 Troubleshooting

### Problemas Comuns:

1. **Erro de migração**: Certifique-se de que não há dados conflitantes no banco
2. **Tipos TypeScript**: Regenere o cliente Prisma após alterações no schema
3. **Permissões não funcionando**: Verifique se todos os 4 níveis foram atualizados
4. **Menu não aparece**: Confirme se o role está incluído no array `roles`

### Comandos Úteis:

```bash
# Reset completo do banco
npx prisma migrate reset

# Visualizar banco de dados
npx prisma studio

# Verificar schema
npx prisma validate
```

## 📚 Referências

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT.io](https://jwt.io/)
- [Zod Documentation](https://zod.dev/)

---

**Última atualização**: 06/07/2025
**Autor**: Claude AI
**Versão**: 1.0