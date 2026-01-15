"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
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
import { CategoryForm } from "./parcials/form";

// Mock data for categories
const initialCategories = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    description: "All things tech.",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Health",
    slug: "health",
    description: "Health and wellness news.",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Business",
    slug: "business",
    description: "Market trends and business insights.",
    createdAt: "2024-01-03",
  },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newCategory = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCategories([...categories, newCategory]);
      setIsLoading(false);
      setIsCreateOpen(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
      setCategories(categories.filter((c) => c.id !== id));
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
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your articles.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm onSubmit={handleCreate} isLoading={isLoading} />
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </Button>
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
