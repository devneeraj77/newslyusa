import db from "@/lib/prisma";
import { CategoryClient } from "./category-client";

export const dynamic = 'force-dynamic';

export default async function CategoryPage() {
  let categories = [];
  try {
    categories = await db.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // You could also redirect to an error page or return a specific error component
  }

  return <CategoryClient initialCategories={categories} />;
}
