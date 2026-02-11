"use server";
import Link from "next/link";
import Image from "next/image";
import db from "@/lib/prisma";
import { formatDateForGrid, stripHtml } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Dot } from "lucide-react";

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
    <div className="w-full py-8">
      <div className="grid group grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-12">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={
              categoryId
                ? `/${categorySlug}/${post.slug}`
                : `/${post.categories[0]?.slug || "news"}/${post.slug}`
            }
            className="group flex flex-col h-full"
          >
            <div className="relative aspect-[4/2] w-full overflow-hidden  bg-muted mb-4 shadow-sm">
              <Image
                src={
                  post.image || "https://placehold.co/600x400/F5F3F6/B9A2B2/png"
                }
                alt={post.title}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col flex-grow gap-3">
              <div className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span className="text-primary truncate">
                  {post.categories[0]?.name}
                </span>
                <Dot className="text-muted-foreground/40" size={20} />
                <span>{formatDateForGrid(post.createdAt)}</span>
              </div>
              <h3 className="font-semibold font-mono text-2xl leading-tight group-hover:underline decoration-2 decoration-shade transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                {stripHtml(post.content || "").slice(0, 100)}...
              </p>
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
                className={
                  page <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {totalPages <= 5 ? (
              Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href={getPageUrl(i + 1)}
                    isActive={page === i + 1}
                  >
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
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
