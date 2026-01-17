
import db from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Post, Category, Admin } from "@/generated/prisma/client";

type Props = {
  params: Promise<{ category: string }>;
};

type PostWithRelations = Post & {
    author: Admin;
    categories: Category[];
}

type CategoryWithPosts = Category & {
    posts: PostWithRelations[];
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  return {
    title: `News - ${decodedCategory}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  // 1. Find category by name or slug
  const categoryData = await db.category.findFirst({
    where: {
      OR: [
        { name: { equals: decodedCategory, mode: "insensitive" } },
        { slug: { equals: decodedCategory, mode: "insensitive" } },
      ],
    },
  });

  if (!categoryData) {
     redirect('/news');
  }

  // 2. Find posts that reference this category
  // We query the Post model directly using the category ID to ensure we find all related posts,
  // avoiding potential issues with the other side of the many-to-many relation.
  const posts = await db.post.findMany({
    where: {
      published: true,
      categoryIds: {
        has: categoryData.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      categories: true,
    },
  });

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 capitalize">{categoryData.name} News</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${category}/${post.slug}`}
            className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
               <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground flex-wrap">
                {post.categories.map((cat) => (
                  <span key={cat.id} className="font-medium text-primary bg-secondary/10 px-2 py-0.5 rounded text-xs">
                    {cat.name}
                  </span>
                ))}
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
        <p className="text-center text-muted-foreground">No news found in this category.</p>
      )}
    </main>
  );
}
