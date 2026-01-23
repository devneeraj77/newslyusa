import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationWithLinksProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  pageSearchParam?: string; // Default: 'page'
}

export function PaginationWithLinks({
  currentPage,
  totalCount,
  pageSize,
  pageSearchParam = "page",
}: PaginationWithLinksProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    // We only need to return the search param string, e.g., "?page=2"
    // The link component will append this to the current pathname
    // But Link href needs a full path or query object.
    // simpler approach: assume we are on the page and just append query params.
    // However, server components don't know the full pathname easily without headers.
    // But PaginationLink uses Link from next/link which handles relative paths well?
    // Actually, providing a query-only string `?page=2` to href works in Next.js Link
    // as long as we want to stay on the same route.
    
    // Better robust way: construct URLSearchParams
    const searchParams = new URLSearchParams();
    searchParams.set(pageSearchParam, page.toString());
    return `?${searchParams.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        {totalPages <= 5 ? (
          Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                href={getPageUrl(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          <>
            <PaginationItem>
              <PaginationLink href={getPageUrl(1)} isActive={currentPage === 1}>
                1
              </PaginationLink>
            </PaginationItem>

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink href={getPageUrl(currentPage - 1)}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage !== 1 && currentPage !== totalPages && (
              <PaginationItem>
                <PaginationLink href={getPageUrl(currentPage)} isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink href={getPageUrl(currentPage + 1)}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                href={getPageUrl(totalPages)}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
