
import Link from "next/link";
import { Metadata } from "next";
import db from "@/lib/prisma";
import { Post, Category, Admin } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest News",
  description: "Read the latest news and updates.",
};

type PostWithRelations = Post & {
  categories: Category[];
  author: Admin;
};

export default async function NewsPage() {
  let posts: PostWithRelations[];
  try {
    posts = await db.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categories: true,
        author: true,
      },
      take: 20,
    });
  } catch (error) {
    console.error("Failed to fetch posts from DB, using mock data:", error);
    posts = [
      {
        id: "mock-1",
        title: "Mock News: Database Connection Failed",
        slug: "mock-news-db-failed",
        content: "This is a placeholder news article because the database connection could not be established. Please check your MongoDB connection settings.",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: "mock-admin",
        categoryIds: ["mock-cat"],
        tagIds: [],
        author: { name: "System Admin" } as Admin,
        categories: [{ name: "System" } as Category]
      },
      {
        id: "mock-2",
        title: "Sample Article for Preview",
        slug: "sample-article-preview",
        content: "Another sample article to populate the UI when the database is unreachable. It helps in developing the frontend without a live backend connection.",
        published: true,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
        authorId: "mock-admin",
        categoryIds: ["mock-cat"],
        tagIds: [],
        author: { name: "Editor" } as Admin,
        categories: [{ name: "General" } as Category]
      }
    ] as unknown as PostWithRelations[];
  }

  return (
    <main className="container min-h-screen mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.categories[0]?.name || "news"}/${post.slug}`}
            className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <span className="font-medium text-primary">
                  {post.categories[0]?.name || "Uncategorized"}
                </span>
                <span>•</span>
                <time dateTime={post.createdAt.toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:underline line-clamp-2">
                {post.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3">
                {post.content.substring(0, 150)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">No news posts found.</p>
      )}
    </main>
  );
}
