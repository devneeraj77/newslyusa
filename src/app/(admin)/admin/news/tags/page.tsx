import db from "@/lib/prisma";
import { TagsClient } from "./tags-client";
import { Tag } from "@prisma/client";

export const dynamic = 'force-dynamic';

interface TagsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TagsPage({ searchParams }: TagsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  let tags: Tag[] = [];
  let totalCount = 0;

  try {
    [tags, totalCount] = await Promise.all([
      db.tag.findMany({
        orderBy: {
          name: 'asc',
        },
        skip,
        take: pageSize,
      }),
      db.tag.count(),
    ]);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
  }

  return (
    <TagsClient 
      initialTags={tags}
      currentPage={currentPage}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  );
}
