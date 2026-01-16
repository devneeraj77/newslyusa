"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Image as ImageIcon, Trash } from "lucide-react";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { env } from "process";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    image?: string | null;
    published: boolean;
    categories?: Category[];
    tags?: Tag[];
    categoryIds?: string[]; // Fallback
    tagIds?: string[]; // Fallback
  } | null;
  categories: Category[];
  tags: Tag[];
}

export default function ArticleForm({
  initialData,
  categories,
  tags,
}: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize selected IDs from initialData
  // initialData might have populated objects (categories, tags)
  const initialCategoryIds =
    initialData?.categories?.map((c) => c.id) || initialData?.categoryIds || [];
  const initialTagIds =
    initialData?.tags?.map((t) => t.id) || initialData?.tagIds || [];

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    published: initialData?.published || false,
    categoryIds: initialCategoryIds,
    tagIds: initialTagIds,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleCategoryChange = (
    checked: boolean | string,
    categoryId: string
  ) => {
    setFormData((prev) => {
      const currentIds = prev.categoryIds;
      if (checked) {
        return { ...prev, categoryIds: [...currentIds, categoryId] };
      } else {
        return {
          ...prev,
          categoryIds: currentIds.filter((id) => id !== categoryId),
        };
      }
    });
  };

  const handleTagChange = (checked: boolean | string, tagId: string) => {
    setFormData((prev) => {
      const currentIds = prev.tagIds;
      if (checked) {
        return { ...prev, tagIds: [...currentIds, tagId] };
      } else {
        return { ...prev, tagIds: currentIds.filter((id) => id !== tagId) };
      }
    });
  };

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      setFormData((prev) => ({ ...prev, image: result.info.secure_url }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        id: initialData?.id,
      };

      const method = initialData ? "PUT" : "POST";
      const res = await fetch("/api/news/article", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.refresh();
      if (!initialData) {
        // Reset form on successful create
        setFormData({
          title: "",
          slug: "",
          content: "",
          image: "",
          published: false,
          categoryIds: [],
          tagIds: [],
        });
      }
      // Optionally redirect
      if (!initialData) {
        // Maybe redirect to list or just stay
        router.push("/admin/news/allArticle");
      } else {
        router.push("/admin/news/allArticle");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-4 bg-background ">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Article" : "Create New Article"}
      </h2>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Article Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="slug">Slug</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={generateSlug}
                >
                  Generate from Title
                </Button>
              </div>
              <Input
                id="slug"
                name="slug"
                placeholder="article-slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
            </div>
            
             <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex flex-col gap-4">
                {formData.image ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={formData.image}
                      alt="Article cover"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={handleRemoveImage}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={handleImageUpload}
                  >
                    {({ open }) => {
                      return (
                        <div
                          onClick={() => open()}
                          className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 transition-colors hover:bg-muted"
                        >
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          <span className="mt-2 text-sm text-muted-foreground">
                            Upload Featured Image
                          </span>
                        </div>
                      );
                    }}
                  </CldUploadWidget>
                )}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto space-y-2">
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories found.
                  </p>
                )}
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={formData.categoryIds.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(checked, category.id)
                      }
                    />
                    <Label
                      htmlFor={`cat-${category.id}`}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto space-y-2">
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No tags found.
                  </p>
                )}
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={formData.tagIds.includes(tag.id)}
                      onCheckedChange={(checked) =>
                        handleTagChange(checked, tag.id)
                      }
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
        <div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <TiptapEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Write your article content here..."
            />
          </div>
          <div className="flex items-center space-x-2 pt-4">
                    <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="published">Published</Label>
                </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Article" : "Create Article"}
        </Button>
      </form>
    </div>
  );
}
