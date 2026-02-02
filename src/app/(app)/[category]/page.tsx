import db from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
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
import { TextShimmer } from "@/components/ui/text-shimmer";
import { IconTrendingUp } from "@tabler/icons-react";
import { Metadata } from "next";

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
          <div key={i} className="flex flex-col h-full overflow-hidden">
            <Skeleton className="aspect-[17/6] w-full rounded-md" />
            <div className="py-4 flex flex-col gap-2 flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const title = `${decodedCategory} News`;
  const description = `Read the latest ${decodedCategory} news, trends, and updates on Newsly USA.`;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://newslyusa.com";
  const canonicalUrl = `${baseUrl}/${category}`;

  return {
    title,
    description,
    keywords: `${decodedCategory}, news, updates, trends, Newsly USA`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Newsly USA`,
      description,
      url: canonicalUrl,
      type: "website",
    },
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

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const viralPosts = await db.post.findMany({
    where: {
      published: true,
      createdAt: {
        gte: startOfLastMonth,
        lt: startOfCurrentMonth,
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
      <h1 className="text-4xl  font-bold font-sans mb-8 capitalize">
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
                    src={
                      mainPost.image ||
                      "https://placehold.co/600x400/00000/ffffff/png"
                    }
                    alt={mainPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h1 className="text-3xl font-mono font-black leading-tight mb-3 group-hover:underline">
                  {mainPost.title}
                </h1>

                <p className="text-muted-foreground/80 text-sm leading-relaxed mb-4 line-clamp-3">
                  {stripHtml(mainPost.content).substring(0, 200)}...
                </p>
                <div className="flex items-center  text-xs font-bold uppercase tracking-wider">
                  <span className="text-primary/70">
                    {mainPost.categories[0]?.name || categoryData.name}
                  </span>
                  <Dot/>
                  <span className="text-primary/70 font-normal">
                     {formatTimeAgo(mainPost.createdAt)}
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
                      src={
                        post.image ||
                        "https://placehold.co/600x400/00000/ffffff/png"
                      }
                      alt={post.title}
                      fill
                      unoptimized={!post.image}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold font-mono text-[15px] leading-snug group-hover:underline mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                    <span className="text-primary/70">
                      {post.categories[0]?.name || categoryData.name}
                    </span>
                    <span className="text-muted-foreground/70 font-normal">
                      · {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className=" py-8 my-10">
            {viralPosts.length > 0 ? (
              <>
                <div className="flex gap-1">
                  <TextShimmer as="h3" className="text-xl font-bold mb-6">
                  Trending Last Month
                </TextShimmer>
                <IconTrendingUp size={24}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {viralPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${category}/${post.slug}`}
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
                        <h4 className="font-bold text-sm leading-tight group-hover:underline line-clamp-2">
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
        </div>

        <aside className="w-full xl:min-h-250 lg:w-64 shrink-0">
          <div className="sticky top-4 space-y-6">
            {/* Header */}
            <div className="p-1 border-b border-dashed border-muted">
              <p className="text-[10px] flex items-center text-left text-muted-foreground mb-1 uppercase tracking-widest font-bold">
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
            {/* {editorsPicks.length > 0 && (
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
            )} */}

            {/* Minimal Newsletter Sign-up */}
            {/* <div className="p-4 mt-8  bg-muted/10 border border-muted/20">
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
            </div> */}
          </div>
        </aside>
      </section>
      <section className="mt-12 min-h-80">
        <h2 className="text-2xl font-bold mb-4">
          More {categoryData.name} News
        </h2>
        <Suspense key={currentPage} fallback={<CategoryPaginationSkeleton />}>
          <CategoryArticlesPagination
            categoryId={categoryData.id}
            categorySlug={category}
            page={currentPage}
            pageSize={10}
            excludedIds={excludedIds}
          />
        </Suspense>
      </section>
    </main>
  );
}
