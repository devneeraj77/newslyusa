import db from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { Post, Category, Admin } from "@prisma/client";
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
import { IconTrendingUp } from "@tabler/icons-react";
import { TextShimmer } from "@/components/ui/text-shimmer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest News",
  description: "Read the latest news and updates.",
};

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
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-full border  overflow-hidden gap-2"
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type PostWithRelations = Post & {
  categories: Category[];
  author: Admin;
};

export default async function NewsPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  let posts: PostWithRelations[];
  try {
    posts = await db.post.findMany({
      where: {
        published: true,
        categoryIds: { isEmpty: true }
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categories: true,
        author: true,
      },
      take: 5,
    });
  } catch (error) {
    console.error("Failed to fetch posts from DB, using mock data:", error);
    posts = [] as unknown as PostWithRelations[];
  }

  if (posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">No news posts found.</p>
      </main>
    );
  }

  const mainPost = posts[0];
  const remainingPosts = posts.slice(1);

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const lastMonthPosts = await db.post.findMany({
    where: {
      published: true,
      createdAt: {
        gte: thirtyDaysAgo,
        lte: now,
      },
      categoryIds: { isEmpty: true },
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
      categoryIds: { isEmpty: true },
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
      categoryIds: { isEmpty: true },
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
    ...lastMonthPosts.map((p) => p.id),
    ...topStories.map((p) => p.id),
    ...editorsPicks.map((p) => p.id),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_URL || "https://newslyusa.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Latest News",
        "item": `${process.env.NEXT_PUBLIC_URL || "https://newslyusa.com"}/news`,
      },
    ],
  };

  return (
    <main className="max-w-7xl mx-auto p-4 mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold font-sans mb-8 capitalize">Latest News</h1>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Latest News</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="min-h-screen flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Main Featured Article (Latest Post) */}
            <div className="flex flex-col">
              <Link href={`/${mainPost.categories[0]?.slug || "news"}/${mainPost.slug}`} className="group">
                <div className="relative aspect-[17/8] w-full overflow-hidden mb-4">
                  <Image
                    src={mainPost.image || "https://placehold.co/600x400/00000/ffffff/png"}
                    alt={mainPost.title}
                    fill
                    unoptimized={!mainPost.image}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h1 className="text-3xl font-mono font-black leading-tight mb-3 group-hover:underline decoration-3 decoration-shade underline-offset-2">
                  {mainPost.title}
                </h1>
                <p className="text-muted-foreground/80 text-sm leading-relaxed mb-4 line-clamp-3">
                  {stripHtml(mainPost.content).substring(0, 200)}...
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-wider">
                  <span className="text-primary/70">{mainPost.categories[0]?.name || "News"}</span>
                  <Dot />
                  <span className="text-primary/70 font-normal">
                     {formatTimeAgo(mainPost.createdAt)}
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Secondary Articles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-8 content-start">
              {remainingPosts.map((post) => (
                <Link key={post.id} href={`/${post.categories[0]?.slug || "news"}/${post.slug}`} className="group flex flex-col">
                  <div className="relative aspect-video w-full overflow-hidden mb-3">
                    <Image
                      src={post.image || "https://placehold.co/600x400/00000/ffffff/png"}
                      alt={post.title}
                      fill
                      unoptimized={!post.image}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold font-mono text-[15px] leading-snug group-hover:underline decoration-2 decoration-shade underline-offset-2 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                    <span className="text-primary/70">{post.categories[0]?.name || "News"}</span>
                    <span className="text-muted-foreground/70 font-normal">
                       · {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <section>
            <div className=" py-8 my-10">
            {lastMonthPosts.length > 0 ? (
              <>
                <div className="flex gap-1">
                  <TextShimmer as="h3" className="text-xl font-bold mb-6">
                  Trending Last Month
                </TextShimmer>
                <IconTrendingUp size={24}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {lastMonthPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${post.categories[0]?.slug || "news"}/${post.slug}`}
                      className="group flex flex-col gap-2"
                    >
                      <div className="relative aspect-video w-full overflow-hidden ">
                        <Image
                          src={
                            post.image ||
                            "https://placehold.co/600x400/00000/ffffff/png"
                          }
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
                        <h4 className="font-bold text-sm leading-tight group-hover:underline decoration-2 decoration-shade underline-offset-2  line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-10 text-center">
                <TextShimmer as="h3" className="text-xl font-bold mb-6">
                  No trending last month
                </TextShimmer>
                <p className="text-muted-foreground">
                  Check back later for more updates!
                </p>
              </div>
            )}
          </div>
          </section>
        </div>

        {/* 3. Sidebar */}
        <aside className="w-full xl:min-h-250 lg:w-64 shrink-0">
          <div className="sticky top-4 space-y-6">
             {/* Header */}
             <div className="p-1 border-b border-dashed border-muted">
              <p className="text-[10px] text-left flex items-center text-muted-foreground mb-1 uppercase tracking-widest font-bold">
                Top Stories <IconTrendingUp  />
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
                    {/* Rank Number */}
                    <span className="text-2xl font-black text-muted/80 group-hover:text-primary transition-colors">
                      0{index + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:underline decoration-1 decoration-shade underline-offset-2 font-montserrat">
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

             {/* Minimal Newsletter Sign-up */}
             {/* <div className="p-4 mt-8  bg-muted/10 border border-muted/20">
              <p className="text-xs font-bold mb-2">The Newsly Pulse</p>
              <p className="text-[10px] text-muted-foreground mb-3">
                The day&apos;s top 3 stories in your inbox.
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
            </div> */}

          </div>
        </aside>

      </section>

      <section className="mt-12 min-h-80">
        <h2 className="text-2xl font-bold mb-4">
          More News
        </h2>
        <Suspense key={currentPage} fallback={<CategoryPaginationSkeleton />}>
          <CategoryArticlesPagination
            categorySlug="news"
            page={currentPage}
            pageSize={10}
            excludedIds={excludedIds}
          />
        </Suspense>
      </section>
    </main>
  );
}