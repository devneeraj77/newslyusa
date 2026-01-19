import db from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
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

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  return {
    title: `News - ${decodedCategory}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
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
    redirect('/news');
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
        <p className="text-center text-muted-foreground">No news found in this category.</p>
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
        "name": categoryData.name,
        "item": `${process.env.NEXT_PUBLIC_URL || "https://newslyusa.com"}/${categoryData.slug}`,
      },
    ],
  };

  return (
    <main className="max-w-7xl mx-auto p-4  mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold font-sans mb-8 capitalize">{categoryData.name} News</h1>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{categoryData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Main Featured Article (Latest Post) */}
            <div className="flex flex-col">
              <Link href={`/${category}/${mainPost.slug}`} className="group">
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
                  <span className="text-green-800">{mainPost.categories[0]?.name || categoryData.name}</span>
                  <span className="text-gray-400 font-normal">
                    · {formatTimeAgo(mainPost.createdAt)}
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Secondary Articles Grid (Next 4 posts) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 content-start">
              {remainingPosts.map((post) => (
                <Link key={post.id} href={`/${category}/${post.slug}`} className="group flex flex-col">
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
                    <span className="text-green-800">{post.categories[0]?.name || categoryData.name}</span>
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