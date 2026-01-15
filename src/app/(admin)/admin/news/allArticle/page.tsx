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

export default async function AllArticlesPage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      categories: true,
      tags: true,
      author: true,
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Articles</h1>
        <Link href="/admin/news/article">
          <Button>Create New Article</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground"
                >
                  No articles found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div>{post.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {post.slug}
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
                    {post.categories.map((c) => c.name).join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    {post.tags.map((t) => t.name).join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
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
    </div>
  );
}
