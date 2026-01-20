"use server"
import Link from "next/link";
import Image from "next/image";
import db from "@/lib/prisma";
import { stripHtml } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Dot } from "lucide-react";

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

interface CategoryArticlesPaginationProps {
  categoryId: string;
  categorySlug: string;
  page?: number;
  pageSize?: number;
  excludedIds?: string[];
}

export default async function CategoryArticlesPagination({
  categoryId,
  categorySlug,
  page = 1,
  pageSize = 10,
  excludedIds = [],
}: CategoryArticlesPaginationProps) {
  const skip = (page - 1) * pageSize;

  // Parallel fetch: posts and count
  const [posts, totalCount] = await Promise.all([
    db.post.findMany({
      where: {
        published: true,
        categoryIds: {
          has: categoryId,
        },
        id: {
          notIn: excludedIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categories: true,
      },
      skip,
      take: pageSize,
    }),
    db.post.count({
      where: {
        published: true,
        categoryIds: {
          has: categoryId,
        },
        id: {
          notIn: excludedIds,
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Pagination logic helpers
  const getPageUrl = (p: number) => `/${categorySlug}?page=${p}`;

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/${categorySlug}/${post.slug}`} className="group flex flex-col h-full   overflow-hidden ">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={post.image || "/api/placeholder/400/300"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="py-4 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                 <span className="text-primary truncate">{post.categories[0]?.name}</span>
                 <span className="text-muted-foreground items-center font-normal flex whitespace-nowrap">
                   <Dot size={24}/> {formatTimeAgo(post.createdAt)}
                 </span>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:underline line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                {stripHtml(post.content)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={getPageUrl(page - 1)} />
              </PaginationItem>
            )}

             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Show first, last, current, and neighbors
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 1 && p <= page + 1)
                ) {
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink href={getPageUrl(p)} isActive={p === page}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                // Show ellipsis
                if (
                    (p === page - 2 && p > 1) ||
                    (p === page + 2 && p < totalPages)
                ) {
                     return <PaginationItem key={p}><PaginationEllipsis /></PaginationItem>;
                }
                return null;
             })}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext href={getPageUrl(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
    </div>
  );
}