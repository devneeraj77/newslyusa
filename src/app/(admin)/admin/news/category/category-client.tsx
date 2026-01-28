"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm, CategoryFormValues } from "./parcials/form";
import { createCategory, deleteCategory, updateCategory } from "./actions";
import { Category } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { IconEdit } from "@tabler/icons-react";

type CategoryWithCount = Category & { _count: { posts: number } };

interface CategoryClientProps {
  initialCategories: CategoryWithCount[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export function CategoryClient({ 
  initialCategories,
  currentPage,
  pageSize,
  totalCount
}: CategoryClientProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const { toast } = useToast();

  // Update local state when initialCategories changes (e.g. after revalidate)
  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    setError(null);
    
    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, data);
    } else {
      result = await createCategory(data);
    }

    setIsLoading(false);

    if (result.success && result.data) {
      toast({
        title: editingCategory ? "Category updated" : "Category created",
        description: `The category has been successfully ${editingCategory ? "updated" : "created"}.`,
        variant: "success",
      });
      setIsCreateOpen(false);
      setEditingCategory(null);
    } else {
      setError(result.error as string);
      toast({
        title: "Error",
        description: result.error as string,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category && category._count.posts > 0) {
        toast({
            title: "Cannot delete",
            description: "This category has associated posts. Please delete or reassign the posts first.",
            variant: "destructive"
        });
        return;
    }

    if(!confirm("Are you sure you want to delete this category?")) return;
    
    const result = await deleteCategory(id);
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error as string,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
        variant: "success",
      });
    }
  };

  const handleEdit = (category: CategoryWithCount) => {
    setEditingCategory(category);
    setIsCreateOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center pb-6 justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { 
          setIsCreateOpen(open); 
          if(!open) {
            setError(null); 
            setEditingCategory(null);
          }
        }}>
          <DialogTrigger asChild className="border">
            <Button size="default" className="py-5">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update the category details." : "Add a new category to organize your articles."}
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 ">
                {error}
              </div>
            )}
            <CategoryForm 
              initialData={editingCategory ? {
                name: editingCategory.name || "",
                slug: editingCategory.slug || "",
                description: editingCategory.description || "",
              } : undefined}
              onSubmit={onSubmit} 
              isLoading={isLoading} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-0 gap-4">
        <CardHeader className="p-0">
          <CardTitle>Edit Category</CardTitle>
          <CardDescription>
            A list of all available categories on your site.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Total Posts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category._count?.posts || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <IconEdit  />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDelete(category.id)}
                        disabled={(category._count?.posts || 0) > 0}
                        title={(category._count?.posts || 0) > 0 ? "Cannot delete category with posts" : "Delete category"}
                      >
                        <Trash2 size={64} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No categories found.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <PaginationWithLinks
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}
