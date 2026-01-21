import db from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Post, Category, Admin } from "@/generated/prisma/client";
import Image from "next/image";
import { stripHtml } from "@/lib/utils";
import CategoryArticlesPagination from "@/components/category-articles-pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dot } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function formatTimeAgo(dateString: string | Date) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${Math.max(0, diffInHours)}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function CategoryPaginationSkeleton() {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-full border rounded-lg overflow-hidden gap-2"
          >
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  return {
    title: `News - ${decodedCategory}`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
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
    redirect("/news");
  }

  const posts = await db.post.findMany({
    where: {
      published: true,
      categoryIds: {
        has: categoryData.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      categories: true,
    },
    take: 5, // Taking top 5 to match the layout
  });

  if (posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12 min-h-120 flex justify-center items-center">
        <p className="text-center text-muted-foreground">
          No news found in this category.
        </p>
      </main>
    );
  }

  const mainPost = posts[0];
  const remainingPosts = posts.slice(1);

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const viralPosts = await db.post.findMany({
    where: {
      published: true,
      createdAt: {
        gte: lastMonth,
      },
      categoryIds: {
        has: categoryData.id,
      },
      id: {
        notIn: posts.map((post) => post.id),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      categories: true,
    },
    take: 4,
  });

  const topStories = await db.post.findMany({
    where: {
      published: true,
      isTopStory: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      categories: true,
      tags: true,
    },
  });

  const editorsPicks = await db.post.findMany({
    where: {
      published: true,
      isEditorsPick: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      categories: true,
      tags: true,
    },
  });

  const excludedIds = [
    ...posts.map((p) => p.id),
    ...viralPosts.map((p) => p.id),
    ...topStories.map((p) => p.id),
    ...editorsPicks.map((p) => p.id),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_URL || "https://newslyusa.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryData.name,
        item: `${process.env.NEXT_PUBLIC_URL || "https://newslyusa.com"}/${categoryData.slug}`,
      },
    ],
  };

  return (
    <main className="max-w-7xl mx-auto p-4  mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold font-sans mb-8 capitalize">
        {categoryData.name} News
      </h1>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {categoryData.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="min-h-screen flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Main Featured Article (Latest Post) */}
            <div className="flex flex-col">
              <Link href={`/${category}/${mainPost.slug}`} className="group">
                <div className="relative aspect-[17/8] w-full overflow-hidden mb-4">
                  <Image
                    src={mainPost.image || "/api/placeholder/600/400"}
                    alt={mainPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h1 className="text-3xl font-mono font-black leading-tight mb-3 group-hover:underline">
                  {mainPost.title}
                </h1>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {stripHtml(mainPost.content).substring(0, 200)}...
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <span className="text-primary">
                    {mainPost.categories[0]?.name || categoryData.name}
                  </span>
                  <span className="text-gray-400 font-normal">
                    · {formatTimeAgo(mainPost.createdAt)}
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Secondary Articles Grid (Next 4 posts) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-8 content-start">
              {remainingPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${category}/${post.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden mb-3">
                    <Image
                      src={post.image || "/api/placeholder/300/200"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold font-mono text-[15px] leading-snug group-hover:underline mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                    <span className="text-primary">
                      {post.categories[0]?.name || categoryData.name}
                    </span>
                    <span className="text-gray-400 font-normal">
                      · {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className=" py-8 my-10">
            <h3 className="text-xl font-bold mb-6">Trending Last Month</h3>
            {viralPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {viralPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${category}/${post.slug}`}
                    className="group flex flex-col gap-2"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                      <Image
                        src={post.image || "/api/placeholder/300/200"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        <span className="text-primary">
                          {post.categories[0]?.name}
                        </span>
                        <Dot size={14} />
                        <span>{formatTimeAgo(post.createdAt)}</span>
                      </div>
                      <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">No post available</p>
              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-4 space-y-6">
            {/* Header */}
            <div className="p-1 border-b border-muted">
              <p className="text-[10px] text-left text-muted-foreground mb-1 uppercase tracking-widest font-bold">
                Top Stories
              </p>
            </div>

            {/* Stories List */}
            <div className="flex flex-col gap-5 mt-4">
              {topStories.map((story, index) => (
                <Link
                  key={story.id}
                  href={`/${story.categories[0]?.slug || "news"}/${story.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="flex gap-3">
                    {/* Rank Number - Using your Plum color for the digit */}
                    <span className="text-2xl font-black text-muted/80 group-hover:text-primary transition-colors">
                      0{index + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:underline font-montserrat">
                        {story.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground italic">
                        {formatTimeAgo(story.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

             {/* Editor's Pick */}
            {editorsPicks.length > 0 && (
              <>
                <div className="p-1 border-b border-muted mt-8">
                  <p className="text-[10px] text-left text-muted-foreground mb-1 uppercase tracking-widest font-bold">
                    Editor&apos;s Pick
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  {editorsPicks.map((story) => (
                    <Link
                      key={story.id}
                      href={`/${story.categories[0]?.slug || "news"}/${story.slug}`}
                      className="group cursor-pointer flex gap-3"
                    >
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={story.image || "/api/placeholder/100/100"}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold leading-tight line-clamp-2 group-hover:underline font-montserrat">
                          {story.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          {formatTimeAgo(story.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Minimal Newsletter Sign-up */}
            <div className="p-4 mt-8  bg-muted/10 border border-muted/20">
              <p className="text-xs font-bold mb-2">The Newsly Pulse</p>
              <p className="text-[10px] text-muted-foreground mb-3">
                The day's top 3 stories in your inbox.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background border border-muted p-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </aside>
      </section>
      <section className="mt-12 min-h-80">
        <h2 className="text-2xl font-bold mb-4">
          More {categoryData.name} News
        </h2>
        <Suspense fallback={<CategoryPaginationSkeleton />}>
          <CategoryArticlesPagination
            categoryId={categoryData.id}
            categorySlug={category}
            page={currentPage}
            pageSize={9}
            excludedIds={excludedIds}
          />
        </Suspense>
      </section>
    </main>
  );
}
