
import db from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Post, Category, Admin } from "@/generated/prisma/client";

type Props = {
  params: Promise<{ cateogry: string }>;
};

type PostWithRelations = Post & {
    author: Admin;
    categories: Category[];
}

type CategoryWithPosts = Category & {
    posts: PostWithRelations[];
}

export async function generateMetadata({ params }: Props) {
  const { cateogry } = await params;
  const decodedCategory = decodeURIComponent(cateogry);
  return {
    title: `News - ${decodedCategory}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { cateogry } = await params;
  const decodedCategory = decodeURIComponent(cateogry);

  // Find category by name (assuming name is unique)
  // Note: The folder is [cateogry], so the param is cateogry
  let category: CategoryWithPosts | null;
  try {
    category = await db.category.findUnique({
        where: {
        name: decodedCategory,
        },
        include: {
        posts: {
            where: {
                published: true
            },
            include: {
                author: true,
                categories: true
            }
        },
        },
    });
  } catch (error) {
     console.error("Failed to fetch category from DB, using mock data:", error);
     // Mock data structure matching the expected category object
     category = {
        name: decodedCategory,
        posts: [
            {
                id: "mock-cat-post-1",
                title: `Mock Post in ${decodedCategory}`,
                slug: `mock-post-${decodedCategory.toLowerCase().replace(/\s+/g, '-')}`,
                content: "This is a mock post content because the database is not reachable.",
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: "mock-admin",
                categoryIds: ["mock-cat"],
                tagIds: [],
                author: { name: "System Admin" } as Admin,
                categories: [{ name: decodedCategory } as Category]
            }
        ] as PostWithRelations[]
     } as CategoryWithPosts;
  }

  if (!category) {
     // If category not found in DB, maybe showing empty state or 404
     // For now, let's show a message instead of 404 to avoid breaking if seeding isn't done
     return (
        <div className="container min-h-screen mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold">Category "{decodedCategory}" Not Found</h1>
        </div>
     )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 capitalize">{decodedCategory} News</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {category.posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${cateogry}/${post.slug}`}
            className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
               <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <span className="font-medium text-primary">
                  {category!.name}
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
      {category.posts.length === 0 && (
        <p className="text-center text-muted-foreground">No news found in this category.</p>
      )}
    </main>
  );
}
