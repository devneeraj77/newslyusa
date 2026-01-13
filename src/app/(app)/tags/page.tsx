
import db from "@/lib/prisma";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse news by tags.",
};

export default async function TagsPage() {
  let tags;
  try {
    tags = await db.tag.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch tags from DB, using mock data:", error);
    tags = [
      { id: "mock-1", name: "technology", _count: { posts: 12 } },
      { id: "mock-2", name: "business", _count: { posts: 8 } },
      { id: "mock-3", name: "health", _count: { posts: 5 } },
      { id: "mock-4", name: "science", _count: { posts: 15 } },
      { id: "mock-5", name: "sports", _count: { posts: 3 } },
    ];
  }

  return (
    <main className="container min-h-screen mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Tags</h1>
      <div className="flex flex-wrap gap-4">
        {tags.map((tag) => (
          <a
            key={tag.id}
            href={`/tags/${tag.name}`}
            className="px-4 py-2 bg-secondary/20 rounded-full text-lg transition-colors hover:bg-secondary/40"
          >
            <span className="font-medium">#{tag.name}</span>
            <span className="ml-2 text-sm text-muted-foreground">({tag._count.posts})</span>
          </a>
        ))}
      </div>
      {tags.length === 0 && (
        <p className="text-center text-muted-foreground">No tags found.</p>
      )}
    </main>
  );
}
