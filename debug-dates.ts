
import db from "./src/lib/prisma";

async function main() {
  const posts = await db.post.findMany({
    where: { published: true },
    select: { title: true, createdAt: true, categoryIds: true },
    orderBy: { createdAt: 'desc' }
  });

  console.log("Current Date:", new Date().toISOString());
  console.log("Start of Last Month (calculated):", new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString());
  console.log("30 Days Ago (calculated):", new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());
  
  console.log("\nPublished Posts:");
  for (const post of posts) {
    console.log(`- ${post.title}`);
    console.log(`  Created: ${post.createdAt.toISOString()}`);
    console.log(`  Cats: ${JSON.stringify(post.categoryIds)}`);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
