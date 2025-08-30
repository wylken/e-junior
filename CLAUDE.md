# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev`
- **Build (includes Prisma operations)**: `npm run build`
  - This runs: Prisma generate → Prisma db push → Next.js build
- **Production server**: `npm start`
- **Linting**: `npm run lint`

## Architecture Overview

This is a Next.js 13.5.1 application for "JUNIOR Oficina" - an automotive services company website. The application uses:

### Tech Stack
- **Framework**: Next.js 13 with App Router
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives via shadcn/ui

### Database Schema
Two main models in `prisma/schema.prisma`:
- **BlogPost**: Content management for automotive blog posts with fields for title, slug, content, image, category, tags, and publication status
- **Contact**: Contact form submissions with name, email, phone, message and status tracking

### Project Structure
- `app/` - Next.js App Router pages and API routes
  - `api/blog/` - Blog post API endpoints
  - `api/contact/` - Contact form API endpoints
  - `blog/` - Blog listing and individual post pages
  - Main pages: homepage, about, services, contact
- `components/` - Organized by feature and UI components
  - `forms/` - Form components (ContactForm)
  - `home/` - Homepage sections (Hero, Services, Blog)
  - `layout/` - Layout components (Header, Footer)
  - `ui/` - shadcn/ui component library
- `lib/` - Utilities and data
  - `blog-data.ts` - Initial blog post data for seeding
  - `db.ts` - Prisma client configuration
  - `utils.ts` - Shared utility functions
- `prisma/` - Database schema and configuration

### Key Configuration
- **Static Export**: Configured for static site generation (`output: 'export'`)
- **Images**: Unoptimized for static export compatibility
- **ESLint**: During builds ignored for static export
- **Path Aliases**: `@/*` points to root directory
- **Language**: Portuguese (pt-BR) with automotive industry focus

### Development Notes
- Uses SQLite database (`file:./dev.db`)
- Blog posts use CUID for IDs and slugs for URLs
- Contact forms track submission status (new/read/responded)
- Initial blog data provided in `lib/blog-data.ts` for seeding
- shadcn/ui components configured with neutral base color and CSS variables

### Database Operations
- Run `npx prisma generate` to generate Prisma client
- Run `npx prisma db push` to sync schema with database
- Database seeding available via `lib/seed.ts`

### Content Management
- Blog posts support markdown content, categories, tags, and featured images
- Content is in Portuguese focused on automotive maintenance and services
- Contact form captures customer inquiries with phone support