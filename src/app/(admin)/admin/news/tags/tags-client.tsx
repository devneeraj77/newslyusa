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
import { TagForm, TagFormValues } from "./parcials/form";
import { createTag, deleteTag, updateTag } from "./actions";
import { Tag } from "@/generated/prisma/client";
import { useToast } from "@/components/ui/use-toast";

interface TagsClientProps {
  initialTags: Tag[];
}

export function TagsClient({ initialTags }: TagsClientProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const { toast } = useToast();

  // Update local state when initialTags changes (e.g. after revalidate)
  React.useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const onSubmit = async (data: TagFormValues) => {
    setIsLoading(true);
    setError(null);
    
    let result;
    if (editingTag) {
      result = await updateTag(editingTag.id, data);
    } else {
      result = await createTag(data);
    }

    setIsLoading(false);

    if (result.success && result.data) {
      toast({
        title: editingTag ? "Tag updated" : "Tag created",
        description: `The tag has been successfully ${editingTag ? "updated" : "created"}.`,
        variant: "success",
      });
      setIsCreateOpen(false);
      setEditingTag(null);
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
    if(!confirm("Are you sure you want to delete this tag?")) return;
    
    const result = await deleteTag(id);
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error as string,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Tag deleted",
        description: "The tag has been successfully deleted.",
        variant: "success",
      });
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsCreateOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tags</h2>
          <p className="text-muted-foreground">
            Manage your news tags here.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { 
          setIsCreateOpen(open); 
          if(!open) {
            setError(null); 
            setEditingTag(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? "Edit Tag" : "Create Tag"}</DialogTitle>
              <DialogDescription>
                {editingTag ? "Update the tag details." : "Add a new tag to organize your articles."}
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <TagForm 
              initialData={editingTag ? {
                name: editingTag.name || "",
              } : undefined}
              onSubmit={onSubmit} 
              isLoading={isLoading} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
          <CardDescription>
            A list of all available tags on your site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tag)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {tags.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No tags found.
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
