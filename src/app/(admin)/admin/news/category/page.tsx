import db from "@/lib/prisma";
import { CategoryClient } from "./category-client";
import { Category } from "@prisma/client";

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ searchParams }: CategoryPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  let categories: (Category & { _count: { posts: number } })[] = [];
  let totalCount = 0;

  try {
    // @ts-ignore
    [categories, totalCount] = await Promise.all([
      db.category.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          _count: {
            select: { posts: true },
          },
        },
        skip,
        take: pageSize,
      }),
      db.category.count(),
    ]);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // You could also redirect to an error page or return a specific error component
  }

  return (
    <CategoryClient 
      initialCategories={categories} 
      currentPage={currentPage}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  );
}
