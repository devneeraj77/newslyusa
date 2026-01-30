"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ChevronDown,
  Loader2,
  Image as ImageIcon,
  Trash,
  Plus,
  Check,
  X,
} from "lucide-react";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { createTag } from "../../tags/actions";
import { cn } from "@/lib/utils";
import TiptapEditor from "@/components/ui/tiptap-editor";

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
    description?: string | null;
    image?: string | null;
    published: boolean;
    createdAt?: string | Date;
    categories?: Category[];
    tags?: Tag[];
    categoryIds?: string[]; // Fallback
    tagIds?: string[]; // Fallback
  } | null;
  categories: Category[];
  tags: Tag[];
}

function formatDateForInput(dateString?: string | Date) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function ArticleForm({
  initialData,
  categories,
  tags,
}: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableTags, setAvailableTags] = useState<Tag[]>(tags);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateTag = async (name: string) => {
    if (!name.trim()) return;
    setIsCreatingTag(true);
    try {
      const res = await createTag({ name: name });
      if (res.success && res.data) {
        setAvailableTags((prev) => [...prev, res.data]);
        setFormData((prev) => ({
          ...prev,
          tagIds: [...prev.tagIds, res.data.id],
        }));
        setSearchTerm("");
      } else {
        console.error(res.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Initialize selected IDs from initialData
  // initialData might have populated objects (categories, tags)
  const initialCategoryIds =
    initialData?.categories?.map((c) => c.id) || initialData?.categoryIds || [];
  const initialTagIds =
    initialData?.tags?.map((t) => t.id) || initialData?.tagIds || [];

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    published: initialData?.published || false,
    createdAt: formatDateForInput(initialData?.createdAt) || "",
    categoryIds: initialCategoryIds,
    tagIds: initialTagIds,
  });

  const slugCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugMessage, setSlugMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "title" || name === "slug") {
        if (slugCheckTimeoutRef.current) {
          clearTimeout(slugCheckTimeoutRef.current);
        }
        setSlugMessage(null);
      }

      if (name === "title") {
        const generatedSlug = slugify(value);
        newData.slug = generatedSlug;

        if (value.trim()) {
          slugCheckTimeoutRef.current = setTimeout(async () => {
            setIsCheckingSlug(true);
            try {
              const res = await fetch(
                `/api/news/check-slug?slug=${generatedSlug}&excludeId=${
                  initialData?.id || ""
                }`,
              );
              const data = await res.json();

              if (!data.isUnique) {
                let counter = 1;
                let uniqueSlug = generatedSlug;
                let isUnique = false;
                while (!isUnique && counter < 10) {
                  uniqueSlug = `${generatedSlug}-${counter}`;
                  const res2 = await fetch(
                    `/api/news/check-slug?slug=${uniqueSlug}&excludeId=${
                      initialData?.id || ""
                    }`,
                  );
                  const data2 = await res2.json();
                  if (data2.isUnique) isUnique = true;
                  else counter++;
                }
                setFormData((prev) => ({ ...prev, slug: uniqueSlug }));
              }
              setSlugMessage({ type: "success", text: "Slug is available" });
            } catch (error) {
              console.error("Slug check failed", error);
            } finally {
              setIsCheckingSlug(false);
            }
          }, 800);
        }
      } else if (name === "slug") {
        if (value.trim()) {
          slugCheckTimeoutRef.current = setTimeout(async () => {
            setIsCheckingSlug(true);
            try {
              const res = await fetch(
                `/api/news/check-slug?slug=${value}&excludeId=${
                  initialData?.id || ""
                }`,
              );
              const data = await res.json();

              if (data.isUnique) {
                setSlugMessage({ type: "success", text: "Slug is available" });
              } else {
                setSlugMessage({
                  type: "error",
                  text: "Slug is already taken",
                });
              }
            } catch (error) {
              console.error("Slug check failed", error);
            } finally {
              setIsCheckingSlug(false);
            }
          }, 800);
        }
      }
      return newData;
    });
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleCategoryChange = (
    checked: boolean | string,
    categoryId: string,
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

  const handleImageUpload = useCallback((result: any) => {
    if (result.event === "success") {
      setFormData((prev) => ({ ...prev, image: result.info.secure_url }));
    }
  }, []);

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        createdAt: formData.createdAt
          ? new Date(formData.createdAt).toISOString()
          : undefined,
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
          description: "",
          content: "",
          image: "",
          published: false,
          createdAt: "",
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
        <div className="bg-destructive/15 text-destructive p-3  mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" >Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Article Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 h-18">
              <Label htmlFor="slug" >Slug</Label>
              <div className="relative">
                <Input
                  id="slug"
                  name="slug"
                  placeholder="article-slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                {isCheckingSlug && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {slugMessage && (
                <div
                  className={cn(
                    "text-xs flex items-center gap-1",
                    slugMessage.type === "success"
                      ? "text-green-600"
                      : "text-destructive",
                  )}
                >
                  {slugMessage.type === "success" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  {slugMessage.text}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" >Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Short description of the article (optional)"
                value={formData.description}
                onChange={handleChange}
                rows={3} // Changed to 3 rows for a shorter description
              />
            </div>

            <div className="space-y-2">
              <Label >Featured Image</Label>
              <div className="flex flex-col gap-4">
                {formData.image && (
                  <div className="relative bg-red-100 aspect-[17/5]  overflow-hidden ">
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
                )}
                <div className={formData.image ? "hidden" : "block"}>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    onSuccess={handleImageUpload}
                  >
                    {({ open }) => {
                      return (
                        <div
                          onClick={() => open()}
                          className="flex aspect-[17/5]  cursor-pointer flex-col items-center justify-center  border border-dashed bg-muted/50 transition-colors hover:bg-muted"
                        >
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          <span className="mt-2 text-sm text-muted-foreground">
                            Upload Featured Image
                          </span>
                        </div>
                      );
                    }}
                  </CldUploadWidget>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label >Categories</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.categoryIds.length > 0
                      ? `${formData.categoryIds.length} selected`
                      : "Select Categories"}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground">
                      No categories found
                    </div>
                  )}
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={formData.categoryIds.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(checked, category.id)
                      }
                    >
                      {category.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {formData.categoryIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.categoryIds.map((id) => {
                    const cat = categories.find((c) => c.id === id);
                    return cat ? (
                      <span
                        key={id}
                        className="text-xs bg-muted/40 text-secondary-foreground px-2 py-1 "
                      >
                        {cat.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label >Tags</Label>
              <div className="border   overflow-hidden relative">
                <Command shouldFilter={false}>
                  <div className="relative ">
                    <CommandInput
                      placeholder="Search tags..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    {searchTerm &&
                      !availableTags.some(
                        (tag) =>
                          tag.name.toLowerCase() === searchTerm.toLowerCase(),
                      ) && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-1 top-1/2 h-40 -translate-y-1/2 h-7  w-7"
                          onClick={() => handleCreateTag(searchTerm)}
                          disabled={isCreatingTag}
                        >
                          {isCreatingTag ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                  </div>
                  {searchTerm && (
                    <CommandList className="max-h-[200px]  overflow-y-auto">
                      <CommandGroup>
                        {availableTags
                          .filter((tag) =>
                            tag.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                          )
                          .map((tag) => (
                            <CommandItem
                              key={tag.id}
                              value={tag.name}
                              onSelect={() => {
                                handleTagChange(
                                  !formData.tagIds.includes(tag.id),
                                  tag.id,
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mx-2 h-4 w-2 hover:text-primary",
                                  formData.tagIds.includes(tag.id)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {tag.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  )}
                </Command>
              </div>
              {formData.tagIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tagIds.map((id) => {
                    const tag = availableTags.find((t) => t.id === id);
                    return tag ? (
                      <span
                        key={id}
                        className="text-xs bg-muted/40 text-secondary-foreground px-2 py-1 "
                      >
                        {tag.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-2  ">
            <Label htmlFor="content" >Content</Label>
            <TiptapEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Write your article content here..."
            
            />
            {/* <SimpleEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Write your article content here..."
            
            /> */}
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="published">Published</Label>
          </div>
          <div className="pt-4 max-w-sm">
            <Label htmlFor="createdAt">Publish Date (Optional)</Label>
            <Input
              type="datetime-local"
              id="createdAt"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className="mt-1"
            />
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
