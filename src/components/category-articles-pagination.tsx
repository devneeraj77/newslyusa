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
  categoryId?: string;
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

  const whereClause: any = {
    published: true,
    categoryIds: { isEmpty: true },
    id: {
      notIn: excludedIds,
    },
  };

  if (categoryId) {
    whereClause.categoryIds = {
      has: categoryId,
    };
  }

  // Parallel fetch: posts and count
  const [posts, totalCount] = await Promise.all([
    db.post.findMany({
      where: whereClause,
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
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Pagination logic helpers
  const getPageUrl = (p: number) => `/${categorySlug}?page=${p}`;

  return (
    <div  className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={categoryId ? `/${categorySlug}/${post.slug}` : `/${post.categories[0]?.slug || "news"}/${post.slug}`} 
            className="group flex flex-col h-full   overflow-hidden "
          >
            <div className="relative aspect-[17/6] w-full overflow-hidden">
              <Image
                src={post.image || "https://placehold.co/600x400/F5F3F6/B9A2B2/png"}
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
              {/* <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                {stripHtml(post.content).length > 120
                  ? `${stripHtml(post.content).slice(0, 60)}...`
                  : stripHtml(post.content)}
              </p> */}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? getPageUrl(page - 1) : "#"}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>

            {totalPages <= 5 ? (
              Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink href={getPageUrl(i + 1)} isActive={page === i + 1}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : (
              <>
                <PaginationItem>
                  <PaginationLink href={getPageUrl(1)} isActive={page === 1}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {page > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {page > 2 && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(page - 1)}>
                      {page - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {page !== 1 && page !== totalPages && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(page)} isActive>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {page < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(page + 1)}>
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {page < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink
                    href={getPageUrl(totalPages)}
                    isActive={page === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href={page < totalPages ? getPageUrl(page + 1) : "#"}
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : undefined}
                className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}