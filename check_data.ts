
import { PrismaClient } from './src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    // Check Categories
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    console.log('Categories found:', categories.length);
    categories.forEach(c => {
      console.log(`- ${c.name} (Slug: ${c.slug}): ${c._count.posts} posts`);
    });

    // Check specific posts for Health and Sports
    const healthPosts = await prisma.post.findMany({
      where: {
        categories: {
          some: {
            name: {
              equals: 'Health',
              mode: 'insensitive'
            }
          }
        }
      }
    });
    console.log(`\n'Health' posts count via query: ${healthPosts.length}`);

    const sportsPosts = await prisma.post.findMany({
      where: {
        categories: {
          some: {
            name: {
              equals: 'Sports',
              mode: 'insensitive'
            }
          }
        }
      }
    });
    console.log(`'Sports' posts count via query: ${sportsPosts.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
