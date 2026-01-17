
import db from "./src/lib/db";

async function main() {
  console.log("Fetching categories...");
  const categories = await db.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });

  console.log("Categories found:", categories.length);
  for (const cat of categories) {
    console.log(`Category: ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
    console.log(`  - postIds count (DB array): ${cat.postIds.length}`);
    console.log(`  - posts count (Relation): ${cat._count.posts}`);
    
    // Check if there are posts that point to this category but are not in postIds
    const postsPointingToCat = await db.post.count({
        where: {
            categoryIds: { has: cat.id }
        }
    });
    console.log(`  - Posts claiming this category (categoryIds has ID): ${postsPointingToCat}`);
  }

  console.log("\nFetching first 5 posts...");
  const posts = await db.post.findMany({
    take: 5,
    select: {
        id: true,
        title: true,
        categoryIds: true,
        published: true
    }
  });
  
  for (const post of posts) {
      console.log(`Post: ${post.title} (ID: ${post.id}, Published: ${post.published})`);
      console.log(`  - categoryIds: ${JSON.stringify(post.categoryIds)}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
