import prisma from "@/lib/prisma";
import ArticleForm from "./parcials/form";

interface ArticlePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlePage({
  searchParams,
}: ArticlePageProps) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id as string | undefined;

  let article = null;
  if (id) {
    article = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
      },
    });
  }

  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="p-6">
       <ArticleForm 
          initialData={article} 
          categories={categories} 
          tags={tags} 
       />
    </div>
  );
}
