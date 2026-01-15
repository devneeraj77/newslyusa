"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ArticleActionsProps {
  article: {
    id: string;
    published: boolean;
  };
}

export default function ArticleActions({ article }: ArticleActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news/article", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          published: !article.published,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/news/article?id=${article.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete article");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={`/admin/news/article?id=${article.id}`}>
            <DropdownMenuItem className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
            </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={togglePublish} disabled={loading} className="cursor-pointer">
          {article.published ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Publish
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteArticle} disabled={loading} className="text-red-600 cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
