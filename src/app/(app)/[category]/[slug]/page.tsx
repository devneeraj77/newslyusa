import { IconUserFilled } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params;

  const decodedCategory = decodeURIComponent(category);

  const categoryData = await db.category.findFirst({
    where: {
      OR: [
        { name: { equals: decodedCategory, mode: "insensitive" } },
        { slug: { equals: decodedCategory, mode: "insensitive" } },
      ],
    },
  });

  if (!categoryData) {
    return {
      title: "Category Not Found",
    };
  }

  const post = await db.post.findUnique({
    where: { slug },
    include: { author: true, tags: true, categories: true },
  });

  if (!post || !post.published || !post.categoryIds.includes(categoryData.id)) {
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

  const decodedCategory = decodeURIComponent(category);

  const categoryData = await db.category.findFirst({
    where: {
      OR: [
        { name: { equals: decodedCategory, mode: "insensitive" } },
        { slug: { equals: decodedCategory, mode: "insensitive" } },
      ],
    },
  });

  if (!categoryData) {
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
  let post: PostWithDetails | null = null;
  try {
    post = await db.post.findUnique({
      where: {
        slug: slug,
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
  }

  if (!post || !post.published || !post.categoryIds.includes(categoryData.id)) {
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
                          ?.name || category}
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
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-mono font-bold mb-4">
                {post.title}
              </h1>
              <div className="flex items-end  justify-between">
                <div className="flex  md:pt-4  gap-2 items-center text-sm text-muted-foreground">
                  {/* <Image src={"https://placehold.co/400/png"}   alt={post.author.name} width={30} height={10} className="border rounded-full"/> */}

                  <div className=" h-9 w-9  flex justify-center items-center  rounded-full bg-muted/20">
                    <IconUserFilled size={20} className="text-primary/10" />
                  </div>
                  <div className="">
                    <div className="flex font-sans text-sm text-primary font-semibold items-center ">
                      {post.author?.name && (
                        <span className=" text-sm">
                          {post.author.name}
                        </span>
                      )}
                    </div>
                    <time
                      className="text-xs  uppercase tracking-wider mb-1 text-primary/70 "
                      dateTime={post.createdAt.toISOString()}
                    >
                      {new Date(post.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        timeZoneName: "short",
                      })}
                    </time>
                  </div>
                </div>
                <div>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 850px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
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
