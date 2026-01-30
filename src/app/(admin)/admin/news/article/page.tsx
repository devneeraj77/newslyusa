import prisma from "@/lib/prisma";
import ArticleForm from "./parcials/form";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlePage({ searchParams }: ArticlePageProps) {
  try {
    const resolvedSearchParams = await searchParams;
    const idParam = resolvedSearchParams?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    let article = null;

    if (id) {
      const rawArticle = await prisma.post.findUnique({
        where: { id },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (rawArticle) {
        article = {
          id: rawArticle.id,
          title: rawArticle.title,
          slug: rawArticle.slug,
          content: rawArticle.content,
          description: rawArticle.description,
          image: rawArticle.image,
          published: rawArticle.published,
          createdAt: rawArticle.createdAt.toISOString(),
          categories: rawArticle.categories,
          tags: rawArticle.tags,
        };
      }
    }

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return (
      <div className="md:p-6">
        <ArticleForm
          initialData={article}
          categories={categories}
          tags={tags}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading article page:", error);
    // You might want to return a custom error component here
    throw error;
  }
}
