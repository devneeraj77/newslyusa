import db from "@/lib/prisma";
import { TagsClient } from "./tags-client";
import { Tag } from "@/generated/prisma/client";

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  let tags: Tag[] = [];
  try {
    tags = await db.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error("Failed to fetch tags:", error);
  }

  return <TagsClient initialTags={tags} />;
}
