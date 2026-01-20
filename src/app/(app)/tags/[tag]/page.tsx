import db from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { stripHtml } from "@/lib/utils";
import type { Metadata } from "next";
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
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).replace(/-/g, ' ');
  // Simple capitalization for title
  const title = decodedTag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `News - ${title}`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  // Try to find the tag by name, handling both direct match and "slugified" match (replacing - with space)
  // This is a workaround since we don't have a slug field in the Tag model.
  const possibleTagName = decodedTag.replace(/-/g, ' ');

  const tagData = await db.tag.findFirst({
    where: {
      OR: [
        { name: { equals: decodedTag, mode: "insensitive" } },
        { name: { equals: possibleTagName, mode: "insensitive" } }
      ]
    },
  });

  if (!tagData) {
     redirect('/news');
  }

  const posts = await db.post.findMany({
    where: {
      published: true,
      tagIds: {
        has: tagData.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      categories: true,
    },
  });

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
        "name": tagData.name,
        "item": `${process.env.NEXT_PUBLIC_URL || "https://newslyusa.com"}/tags/${tag}`,
      },
    ],
  };

  return (
    <main className="max-w-7xl mx-auto p-4 mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-baseline justify-between mb-8">
         <h1 className="text-4xl font-bold font-sans capitalize">{tagData.name} <span className="text-muted-foreground text-2xl font-normal">({posts.length})</span></h1>
      </div>
     
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{tagData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No news found with this tag.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/${post.categories[0]?.slug || 'news'}/${post.slug}`} className="group flex flex-col h-full  overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={post.image || "/api/placeholder/400/300"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="py-4 flex flex-col flex-1">
                   <h2 className="font-bold font-mono text-lg leading-snug group-hover:underline mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                     <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {stripHtml(post.content).substring(0, 150)}...
                      </p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mt-auto">
                      <span className="text-green-800">{post.categories[0]?.name || "News"}</span>
                      <span className="text-gray-400 font-normal">
                        · {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </main>
  );
}
