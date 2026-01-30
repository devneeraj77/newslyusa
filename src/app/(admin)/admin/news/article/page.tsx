import prisma from "@/lib/prisma";
import ArticleForm from "./parcials/form";

interface ArticlePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlePage({
  searchParams,
}: ArticlePageProps) {
  const resolvedSearchParams = await searchParams;
  const idParam = resolvedSearchParams?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  let article = null;
  if (id) {
    const rawArticle = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
      },
    });
    if (rawArticle) {
      article = JSON.parse(JSON.stringify(rawArticle));
    }
  }

  const rawCategories = await prisma.category.findMany();
  const rawTags = await prisma.tag.findMany();
  
  const categories = JSON.parse(JSON.stringify(rawCategories));
  const tags = JSON.parse(JSON.stringify(rawTags));

  return (
    <div className="md:p-6">
       <ArticleForm 
          initialData={article} 
          categories={categories} 
          tags={tags} 
       />
    </div>
  );
}
