import { notFound } from "next/navigation";
import { Metadata } from "next";
import db from "@/lib/prisma";
import { Post, Category, Tag, Admin } from "@/generated/prisma/client";
import { blogSanitizer } from "@/lib/utils";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconUserFilled } from "@tabler/icons-react";

type Props = {
  params: Promise<{ slug: string; category: string }>;
};

type PostWithDetails = Post & {
  author: Admin;
  categories: Category[];
  tags: Tag[];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `News - ${slug}`,
  };
}

export default async function NewsPage({ params }: Props) {
  const { slug, category } = await params;

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

  if (!post) {
    return (
      <div className="container mx-auto flex justify-center items-center flex-col min-h-125 py-12 text-center">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <p className="text-muted-foreground">
          The article you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="">
        
        <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4">
          {post.title}
        </h1>
        <div className="flex  gap-4 items-baseline  text-sm text-muted-foreground">
          {/* <Image src={"https://placehold.co/400/png"}   alt={post.author.name} width={30} height={10} className="border rounded-full"/> */}
          
          <div className="flex font-mono text-[1rem] font-bold gap-2 items-center">
            {/* <div className=" h-8 w-8 flex justify-center items-center rounded-full bg-muted/50">
              <IconUserFilled size={20} className="text-secondary" />
            </div> */}
            By
            {post.author?.name && (
              <span className="font-bold ">{post.author.name}</span>
            )}
          </div>
          <time className="text-xs font-medium text-muted-foreground" dateTime={post.createdAt.toISOString()}>
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
        {/* Breadcrumbs */}
        <div className="mt-4 mb-4 ">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-destructive font-semibold">
                <BreadcrumbLink href={`/${category}`}>
                  {post.categories.find((c) => c.slug === category)?.name ||
                    category}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-54 sm:max-w-xs md:max-w-xs ">
                  {post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <div className="relative aspect-[17/12]  md:aspect-[17/7] w-full overflow-hidden ">
          <Image
            src={post.image || "https://placehold.co/600x400/F5F3F6/B9A2B2/png"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300  group-hover:scale-105"
          />
        </div>
        {blogSanitizer(post.content || "")}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-8 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag.id} className="text-sm text-muted-foreground">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
