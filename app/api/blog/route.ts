import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const where: any = { published: true };
    
    if (category && category !== 'Todos') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }
    
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        author: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { title, excerpt, content, image, category, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Título, conteúdo e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        image: image || '',
        category,
        tags: JSON.stringify(tags || []),
        published: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
});