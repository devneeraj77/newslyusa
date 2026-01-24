import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, X } from "lucide-react";
import ArticleActions from "./article-actions";
import ArticleStatusToggle from "./article-status-toggle";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import { Prisma } from "@/generated/prisma/client";


interface AllArticlesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function ArticlesTableSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Editor's Pick</TableHead>
             <TableHead>
                Top Story <span className="text-xs">(0/5)</span>
              </TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium md:max-w-xs">
                 <Skeleton className="h-4 w-[250px] mb-2" />
                 <Skeleton className="h-3 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[40px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[40px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

async function ArticlesTable({
  currentPage,
  pageSize,
  query,
}: {
  currentPage: number;
  pageSize: number;
  query: string;
}) {
  const skip = (currentPage - 1) * pageSize;

  const where: Prisma.PostWhereInput = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [posts, totalCount, totalTopStories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categories: true,
        tags: true,
        author: true,
      },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where }),
    prisma.post.count({
      where: {
        isTopStory: true,
      },
    }),
  ]);

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Editor's Pick</TableHead>
              <TableHead>
                Top Story <span className="text-xs">({totalTopStories}/5)</span>
              </TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-40 text-muted-foreground"
                >
                  No articles found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium md:max-w-xs">
                    <div className="truncate w-sm sm:w-auto">{post.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <p className="truncate w-xs">{post.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.published ? (
                      <div className="flex items-center text-green-600">
                        <Check className="mr-1 h-4 w-4" /> Published
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <X className="mr-1 h-4 w-4" /> Draft
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <ArticleStatusToggle
                      id={post.id}
                      field="isEditorsPick"
                      initialChecked={!!post.isEditorsPick}
                      disabled={!post.published}
                    />
                  </TableCell>
                  <TableCell>
                    <ArticleStatusToggle
                      id={post.id}
                      field="isTopStory"
                      initialChecked={!!post.isTopStory}
                      disabled={
                        !post.published ||
                        (!post.isTopStory && totalTopStories >= 5)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {post.categories.map((c) => c.name).join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <ArticleActions article={post} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <PaginationWithLinks
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
        />
      </div>
    </>
  );
}

export default async function AllArticlesPage({
  searchParams,
}: AllArticlesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const query = (params.q as string) || "";
  const pageSize = 10;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">All Articles</h1>
        <div className="flex items-center  rounded-lg gap-2 w-full sm:w-auto">
          <SearchInput className="w-full  sm:w-[300px]" placeholder="Search articles..." />
          <Link href="/admin/news/article">
            <Button>Create New Article</Button>
          </Link>
        </div>
      </div>

      <Suspense key={currentPage + query} fallback={<ArticlesTableSkeleton />}>
        <ArticlesTable currentPage={currentPage} pageSize={pageSize} query={query} />
      </Suspense>
    </div>
  );
}
