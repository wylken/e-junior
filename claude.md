# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔧 Development Commands

### Core Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint linting
```

### Database Operations (Prisma)
```bash
npm run db:migrate   # Run database migrations (use for schema changes)
npm run db:push      # Push schema changes directly (for prototyping)
npm run db:seed      # Populate database with initial data
npm run db:studio    # Open Prisma Studio (database GUI)
```

### Testing
- No test suite is currently configured
- When adding tests, document the test command here

## 🏗️ Architecture Overview

### Tech Stack
- **Next.js 15.3.5** with App Router and TypeScript strict mode
- **Prisma ORM** with SQLite database (configurable via DATABASE_URL)
- **JWT Authentication** using `jose` library (15min access + 7d refresh tokens)
- **Shadcn/UI + Aceternity UI** for components with Tailwind CSS
- **Zod** for schema validation throughout the application
- **React Hook Form** for form handling with Zod resolvers

### Database Models (Prisma)
Key models in `prisma/schema.prisma`:
- **User**: Authentication + profile (roles: ADMIN/CLIENT)
- **Configuration**: Dynamic system settings (5 types: URL/TEXT/NUMBER/BOOLEAN/JSON)
- **RefreshToken**: JWT refresh token management
- **PasswordResetToken**: Password reset functionality

### Authentication Flow
1. **JWT-based** with httpOnly cookies for security
2. **Middleware protection** in `src/middleware.ts` handles route access
3. **Role-based access**: ADMIN can access `/users` and `/settings`, CLIENT only `/dashboard` and `/profile`
4. **Auto-redirect** to `/login` for unauthenticated requests to protected routes

### Route Structure
```
app/
├── (auth)/              # Protected routes - require authentication
│   ├── dashboard/       # Main dashboard (all roles)
│   ├── users/          # User management (ADMIN only)
│   ├── settings/       # System config (ADMIN only) 
│   └── profile/        # User profile (all roles)
├── (public)/           # Public routes - no auth required
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
└── api/                # API endpoints
    ├── auth/           # Authentication endpoints
    ├── users/          # User CRUD operations  
    └── config/         # Configuration management
```

### Service Layer Pattern
Business logic is abstracted into services in `src/services/`:
- **AuthService** (`auth.ts`): Login, register, password reset
- **UserService** (`user.ts`): User CRUD with role validation
- **ConfigService** (`config.ts`): Dynamic configuration management
- **EmailService** (`email.ts`): Email sending (SMTP/n8n webhook support)

### Validation Strategy
- **Zod schemas** in `src/schemas/` define validation rules
- **API routes** validate input using these schemas
- **Forms** use React Hook Form with Zod resolvers for client-side validation
- **TypeScript types** are generated from Zod schemas where possible

### Component Organization
```
components/
├── ui/                 # Shadcn/UI base components (Button, Card, etc.)
├── forms/              # Specific form components with validation
└── layout/             # Layout components (Header, Sidebar, ThemeProvider)
```

## 🔐 Environment Variables

Required variables (create `.env.local`):
```env
# Database
DATABASE_URL="file:./dev.db"                    # SQLite path or PostgreSQL URL

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key"          # Access token signing key
JWT_REFRESH_SECRET="your-refresh-secret-key"    # Refresh token signing key

# Email System (for password reset)
EMAIL_PROVIDER="smtp"                           # "smtp" or "n8n"
SMTP_HOST="smtp.gmail.com"                      # SMTP server
SMTP_PORT="587"                                 # SMTP port
SMTP_USER="your-email@gmail.com"                # SMTP username
SMTP_PASSWORD="your-app-password"               # SMTP password
N8N_WEBHOOK_URL="https://your-n8n.com/webhook" # Alternative to SMTP

# File Upload
UPLOAD_FOLDER="./uploads"                       # File storage path
MAX_FILE_SIZE="5242880"                         # 5MB in bytes

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"     # Base app URL
NEXT_PUBLIC_APP_NAME="Template Base"            # App display name
```

## 🎨 UI System

### Theme System
- **next-themes** provider in `src/components/layout/theme-provider.tsx`
- **Dark/light mode** toggle available in header dropdown
- **Tailwind CSS** with CSS variables for theming

### Component Libraries
- **Shadcn/UI**: Base components following Radix UI patterns
- **Aceternity UI**: Additional animated/advanced components  
- **Lucide React**: Icon library
- **Framer Motion**: Animations
- **Sonner**: Toast notifications

### Styling Conventions
- **Tailwind classes** with `cn()` utility (clsx + tailwind-merge)
- **CSS variables** for theme colors in `src/app/globals.css`
- **Mobile-first** responsive design
- **Sidebar layout** that collapses on smaller screens

## 🚀 Development Patterns

### Code Standards
- **TypeScript strict mode** - no `any` types allowed
- **Error boundaries** with try/catch in API routes
- **Consistent error responses** following `{ success: boolean, error?: string, data?: any }` pattern
- **Server Actions** not used - all data fetching via API routes

### Adding New Features
1. **Database**: Add Prisma model if needed, run `npm run db:migrate`
2. **Types**: Define TypeScript interfaces in `src/types/`
3. **Schemas**: Create Zod validation schemas in `src/schemas/`
4. **Service**: Add business logic in `src/services/`
5. **API**: Create route handlers in `src/app/api/`
6. **UI**: Build components in `src/components/`
7. **Pages**: Add routes in appropriate `src/app/` directory

### Authentication Integration
Use `src/hooks/use-auth.ts` for client-side auth state:
```typescript
const { user, isLoading, login, logout } = useAuth();
```

For API protection, check JWT in route handlers:
```typescript
const token = cookies().get('token')?.value;
const user = await verifyAccessToken(token);
```

## 🧪 Default Users (after seeding)
- **Admin**: admin@template.com / admin123
- **Client**: client@template.com / client123

## 📝 Important Notes

- **Database**: Currently uses SQLite for development, easily changeable to PostgreSQL via DATABASE_URL
- **Email**: Flexible system supporting both SMTP and n8n webhooks for sending
- **Security**: Passwords hashed with bcrypt (strength 12), JWT tokens stored in httpOnly cookies
- **Prisma Client**: Generated in `src/generated/prisma` (custom output path)
- **Form Handling**: All forms use React Hook Form + Zod for validation consistency

## 🔍 Key Files to Understand

- `src/middleware.ts` - Route protection and role-based access
- `src/lib/auth.ts` - JWT token generation and validation utilities
- `src/lib/db.ts` - Prisma client configuration
- `prisma/schema.prisma` - Database schema and relationships
- `src/app/layout.tsx` - Root layout with providers
- `src/components/layout/sidebar.tsx` - Navigation component