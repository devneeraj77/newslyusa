"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
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
import { saveArticle, checkSlugUnique } from "../actions";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Badge } from "@/components/ui/badge";
import { SeoStatusCard } from "./seo-status-card";

const TiptapEditor = dynamic(() => import("@/components/ui/tiptap-editor"), {
  ssr: false,
  loading: () => <div className="min-h-[300px] border rounded-md" />,
});

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

  const [availableTags, setAvailableTags] = useState<Tag[]>(tags);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  const categoriesRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategorySearchTerm("");
      }
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateTag = async (name: string) => {
    if (!name.trim()) return;
    setIsCreatingTag(true);
    try {
      const res = await createTag({ name: name });
      if (res.success && res.data) {
        toast.success("Tag created successfully");
        setAvailableTags((prev) => [...prev, res.data]);
        setFormData((prev) => ({
          ...prev,
          tagIds: [...prev.tagIds, res.data.id],
        }));
        setSearchTerm("");
      } else {
        toast.error(res.error || "Failed to create tag");
        console.error(res.error);
      }
    } catch (e) {
      toast.error("Failed to create tag");
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
    createdAt: "",
    categoryIds: initialCategoryIds,
    tagIds: initialTagIds,
  });

  useEffect(() => {
    if (initialData?.createdAt) {
      setFormData((prev) => ({
        ...prev,
        createdAt: formatDateForInput(initialData.createdAt) || "",
      }));
    }
  }, [initialData]);

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
              const res = await checkSlugUnique(
                generatedSlug,
                initialData?.id || "",
              );

              if (!res.isUnique) {
                let counter = 1;
                let uniqueSlug = generatedSlug;
                let isUnique = false;
                while (!isUnique && counter < 10) {
                  uniqueSlug = `${generatedSlug}-${counter}`;
                  const res2 = await checkSlugUnique(
                    uniqueSlug,
                    initialData?.id || "",
                  );
                  if (res2.isUnique) isUnique = true;
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
              const res = await checkSlugUnique(value, initialData?.id || "");

              if (res.isUnique) {
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

    try {
      const payload = {
        ...formData,
        // Optional: Ensure date is in ISO string or passed as string
        createdAt: formData.createdAt,
        id: initialData?.id,
      };

      // Call the Server Action
      const res = await saveArticle(payload);

      if (!res.success) {
        throw new Error(res.message || "Something went wrong");
      }

      toast.success(
        initialData
          ? "Article updated successfully"
          : "Article created successfully",
      );

      // No need for router.refresh() if revalidatePath handles it, but keeps UI sync
      // router.refresh();

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

      router.push("/admin/news/allArticle");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-4 md:p-8 bg-background ">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Article" : "Create New Article"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2 ">
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

            <div className="space-y-2  ">
              <Label htmlFor="slug">Slug</Label>
              <div className="relative">
                <Input
                  className="py-4"
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
                    "text-xs flex items-center ",
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Short description of the article (optional)"
                value={formData.description}
                onChange={handleChange}
                rows={3} // Changed to 3 rows for a shorter description
              />
            </div>
            <div className="space-y-2" ref={categoriesRef}>
              <Label>Categories</Label>
              <div className="border rounded-md overflow-hidden relative">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search categories..."
                    value={categorySearchTerm}
                    onValueChange={setCategorySearchTerm}
                  />
                  <CommandList
                    className={
                      !categorySearchTerm
                        ? "hidden"
                        : "max-h-[200px] overflow-y-auto"
                    }
                  >
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories
                        .filter((category) =>
                          category.name
                            .toLowerCase()
                            .includes(categorySearchTerm.toLowerCase()),
                        )
                        .map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => {
                              handleCategoryChange(
                                !formData.categoryIds.includes(category.id),
                                category.id,
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categoryIds.includes(category.id)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
              {formData.categoryIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.categoryIds.map((id) => {
                    const cat = categories.find((c) => c.id === id);
                    return cat ? <Badge key={id}>{cat.name}</Badge> : null;
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2  h-22" ref={tagsRef}>
              <Label>Tags</Label>
              <div className="border rounded-md overflow-hidden relative">
                <Command shouldFilter={false}>
                  <div className="relative">
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
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
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
                  <CommandList
                    className={
                      !searchTerm ? "hidden" : "max-h-[200px] overflow-y-auto"
                    }
                  >
                    <CommandEmpty>No tag found.</CommandEmpty>
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
                                "mr-2 h-4 w-4",
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
                </Command>
              </div>
              {formData.tagIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tagIds.map((id) => {
                    const tag = availableTags.find((t) => t.id === id);
                    return tag ? <Badge key={id}>{tag.name}</Badge> : null;
                  })}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex flex-col  gap-4">
                {formData.image && (
                  <div className="relative bg-red-100 aspect-[17/7]  rounded-xl overflow-hidden ">
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
                  {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? (
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
                            className="flex aspect-[17/5]  cursor-pointer flex-col items-center justify-center rounded-md  border border-dashed bg-muted/20 transition-colors hover:bg-muted/30"
                          >
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            <span className="mt-2 text-sm text-muted-foreground">
                              Upload Featured Image
                            </span>
                          </div>
                        );
                      }}
                    </CldUploadWidget>
                  ) : (
                    <div className="flex aspect-[17/5] flex-col items-center justify-center rounded-md border border-dashed bg-muted/20 text-destructive">
                      <span className="text-sm">
                        Missing Cloudinary Upload Preset
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className=" bg-shade/5 rounded-lg overflow-hidden">
              <SeoStatusCard data={formData} />
            </div>
          </div>
        </div>
        <div className="">
          <div className="space-y-2  ">
            <Label htmlFor="content">Content</Label>
            {/* <TiptapEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Write your article content here..."
            
            /> */}
            <SimpleEditor
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
