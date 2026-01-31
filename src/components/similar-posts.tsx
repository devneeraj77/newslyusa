import { Dot } from "lucide-react";
import Link from "next/link";
import db from "@/lib/prisma";
import { Skeleton } from "./ui/skeleton";

interface SimilarPostsProps {
  currentPostId: string;
  categoryIds: string[];
}

function formatTimeAgo(dateString: string | Date) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${Math.max(0, diffInHours)}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function SimilarPostsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-1 border-b border-dashed border-muted/10">
        <Skeleton className="h-2.5 w-24  animate-pulse  mb-1" />
      </div>
      <div className="flex flex-col gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-3 w-16  animate-pulse " />
                <Skeleton className="h-3 w-12  animate-pulse " />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 md:h-4 w-full  animate-pulse " />
                <Skeleton className="h-3 md:h-4 w-3/4  animate-pulse " />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SimilarPosts({
  currentPostId,
  categoryIds,
}: SimilarPostsProps) {
  if (!categoryIds || categoryIds.length === 0) {
    return null;
  }

  const similarPosts = await db.post.findMany({
    where: {
      published: true,
      id: {
        not: currentPostId,
      },
      categoryIds: {
        hasSome: categoryIds,
      },
    },
    include: {
      categories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  if (similarPosts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col  gap-6">
      <div className="p-1 border-b border-dashed border-muted">
        <p className="text-[10px] text-left text-muted-foreground mb-1 uppercase tracking-widest font-bold">
          Similar Posts
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {similarPosts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.categories[0]?.slug || "news"}/${post.slug}`}
            className="group flex flex-col gap-3"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs  uppercase tracking-wider mb-1 text-primary">
                <span>{post.categories[0]?.name}</span>
                <span className="text-muted-foreground font-normal flex items-center">
                  <Dot size={16} /> {formatTimeAgo(post.createdAt)}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-primary font-mono md:text-base group-hover:underline line-clamp-2 leading-tight">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
