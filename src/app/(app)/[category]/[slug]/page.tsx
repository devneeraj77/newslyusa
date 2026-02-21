import { IconUserFilled } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, cache } from "react";
import { PostShare } from "@/components/post-share";
import SimilarPosts, { SimilarPostsSkeleton } from "@/components/similar-posts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Admin, Category, Post, Tag } from "@prisma/client";
import db from "@/lib/prisma";
import { blogSanitizer, slugify, stripHtml } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string; category: string }>;
};

type PostWithDetails = Post & {
  author: Admin;
  categories: Category[];
  tags: Tag[];
};

const getCategory = cache(async (category: string) => {
  const decodedCategory = decodeURIComponent(category);
  return db.category.findFirst({
    where: {
      OR: [
        { name: { equals: decodedCategory, mode: "insensitive" } },
        { slug: { equals: decodedCategory, mode: "insensitive" } },
      ],
    },
  });
});

const getPost = cache(async (slug: string) => {
  return db.post.findFirst({
    where: { slug, published: true },
    include: { author: true, tags: true, categories: true },
  });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params;

  const categoryData = await getCategory(category);
  const isDefaultCategory = category.toLowerCase() === "news";

  if (!categoryData && !isDefaultCategory) {
    return {
      title: "Category Not Found",
    };
  }

  const post = await getPost(slug);
  
  const isCategoryMatch = post && (
    (categoryData && post.categoryIds.includes(categoryData.id)) ||
    (isDefaultCategory && post.categoryIds.length === 0)
  );

  if (!post || !isCategoryMatch) {
    return {
      title: "Article Not Found",
      description: "The article you are looking for does not exist.",
    };
  }

  const description = stripHtml(post.content || "").substring(0, 160);
  const keywords = post.tags.map((tag) => tag.name).join(", ");
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://newslyusa.com";
  const categorySlug = post.categories[0]?.slug || category;
  const canonicalUrl = `${baseUrl}/${categorySlug}/${post.slug}`;

  return {
    title: post.title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.image
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@newslyusa",
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { slug, category } = await params;

  const categoryData = await getCategory(category);
  const isDefaultCategory = category.toLowerCase() === "news";

  if (!categoryData && !isDefaultCategory) {
    return (
      <div className="container mx-auto flex justify-center items-center flex-col min-h-150 py-12 text-center">
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-md px-10 text-sm leading-relaxed">
          The category you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  // Safely attempt to fetch the post
  const post = await getPost(slug);

  const isCategoryMatch = post && (
    (categoryData && post.categoryIds.includes(categoryData.id)) ||
    (isDefaultCategory && post.categoryIds.length === 0)
  );

  if (!post || !isCategoryMatch) {
    return (
      <div className="container mx-auto flex justify-center items-center px-10 flex-col min-h-150 py-12 text-center">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-md px-10 text-sm leading-relaxed">
          The article you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="basis-3/2">
          <article className="max-w-4xl">
            <header className="">
              {/* Breadcrumbs */}
              <div className="mt-4 mb-4 ">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="text-primary font-semibold">
                      <BreadcrumbLink href={`/${category}`}>
                        {post.categories.find((c) => c.slug === category)
                          ?.name || categoryData?.name || "News"}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="truncate max-w-44 sm:max-w-xs lg:max-w-xs ">
                        {post.title}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl font-mono font-bold mt-6 md:mt-8">
                {post.title}
              </h1>
              <div className="flex flex-row sm:items-center justify-between gap-4 py-5  border-border/50 ">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10  bg-primary/10 flex items-center justify-center text-primary">
                    <IconUserFilled size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {post.author?.name || "Newsly Team"}
                    </span>
                    <time
                      className="text-xs text-muted-foreground font-medium"
                      dateTime={post.createdAt.toISOString()}
                    >
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        timeZoneName: "short",
                        year: "numeric",
                        
                      })}
                    </time>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PostShare title={post.title} />
                </div>
              </div>
            </header>

            <div className="prose dark:prose-invert max-w-none prose-p:font-sans prose-headings:font-mono prose-a:text-muted-link list-disc marker:text-primary [&>li>p]:text-green-800 prose-a:underline prose-a:font-medium ">
              <div className="relative aspect-video  md:aspect-[17/9]  w-full overflow-hidden ">
                <Image
                  src={
                    post.image ||
                    "https://placehold.co/600x400/00000/ffffff/png"
                  }
                  alt={post.title}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 850px"
                  className="object-cover"
                />
              </div>
              {blogSanitizer(post.content || "")}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-sm text-muted-foreground"
                    >
                      <Link
                        href={`/tags/${slugify(tag.name)}`}
                        className="hover:text-primary transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Sidebar */}
        <aside className="basis-1/2 space-y-8 py-4 sticky top-24 h-fit">
          <Suspense fallback={<SimilarPostsSkeleton />}>
            <SimilarPosts
              currentPostId={post.id}
              categoryIds={post.categoryIds}
            />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}
