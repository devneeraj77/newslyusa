import db from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { Post, Category, Admin } from "@/generated/prisma/client";
import Image from "next/image";
import { stripHtml } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

type PostWithRelations = Post & {
  categories: Category[];
  author: Admin;
};

export default async function NewsPage() {
  let posts: PostWithRelations[];
  try {
    posts = await db.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categories: true,
        author: true,
      },
      take: 9,
    });
  } catch (error) {
    console.error("Failed to fetch posts from DB, using mock data:", error);
    posts = [
      {
        id: "mock-1",
        title: "Mock News: Database Connection Failed",
        slug: "mock-news-db-failed",
        content: "This is a placeholder news article because the database connection could not be established. Please check your MongoDB connection settings.",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: "mock-admin",
        categoryIds: ["mock-cat"],
        tagIds: [],
        author: { name: "System Admin" } as Admin,
        categories: [{ name: "System" } as Category]
      },
      {
        id: "mock-2",
        title: "Sample Article for Preview",
        slug: "sample-article-preview",
        content: "Another sample article to populate the UI when the database is unreachable. It helps in developing the frontend without a live backend connection.",
        published: true,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
        authorId: "mock-admin",
        categoryIds: ["mock-cat"],
        tagIds: [],
        author: { name: "Editor" } as Admin,
        categories: [{ name: "General" } as Category]
      }
    ] as unknown as PostWithRelations[];
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
      <section className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Main Featured Article (Latest Post) */}
            <div className="flex flex-col">
              <Link href={`/${mainPost.categories[0]?.name || "news"}/${mainPost.slug}`} className="group">
                <div className="relative aspect-[16/10] w-full overflow-hidden mb-4">
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
                  <span className="text-green-800">{mainPost.categories[0]?.name || "News"}</span>
                  <span className="text-gray-400 font-normal">
                    · {formatTimeAgo(mainPost.createdAt)}
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Secondary Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 content-start">
              {remainingPosts.map((post) => (
                <Link key={post.id} href={`/${post.categories[0]?.name || "news"}/${post.slug}`} className="group flex flex-col">
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
                    <span className="text-green-800">{post.categories[0]?.name || "News"}</span>
                    <span className="text-gray-400 font-normal">
                       · {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Advertisement Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="border border-gray-100 p-1 sticky top-4">
            {/* <p className="text-[10px] text-right text-gray-400 mb-1 uppercase tracking-widest">Advertisement</p> */}
            
          </div>
        </div>

      </section>
    </main>
  );
}