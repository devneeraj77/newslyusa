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
import { Category } from "@/generated/prisma/client";
import { useToast } from "@/components/ui/use-toast";

interface CategoryClientProps {
  initialCategories: Category[];
}

export function CategoryClient({ initialCategories }: CategoryClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsCreateOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your news categories here.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { 
          setIsCreateOpen(open); 
          if(!open) {
            setError(null); 
            setEditingCategory(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
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
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
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

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            A list of all available categories on your site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No categories found.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
