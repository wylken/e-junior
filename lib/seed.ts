import { prisma } from './db';
import { initialBlogPosts } from './blog-data';

export async function seedDatabase() {
  try {
    // Clear existing data
    await prisma.blogPost.deleteMany();
    
    // Seed blog posts
    for (const post of initialBlogPosts) {
      await prisma.blogPost.create({
        data: {
          ...post,
          tags: JSON.stringify(post.tags)
        }
      });
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}