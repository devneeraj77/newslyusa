import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import db from '@/lib/prisma';
import { Post, Category, Tag, Admin } from "@/generated/prisma/client";
import { stripHtml, blogSanitizer } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string; category: string }>
}

type PostWithDetails = Post & {
    author: Admin;
    categories: Category[];
    tags: Tag[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  return {
    title: `News - ${slug}`, 
  }
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params

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
          tags: true
        }
      })
  } catch (error) {
    console.error("Error fetching post:", error);
  }

  if (!post) {
    return (
        <div className="container mx-auto py-12 text-center">
            <h1 className="text-2xl font-bold">Article Not Found</h1>
            <p className="text-muted-foreground">The article you are looking for does not exist or has been removed.</p>
        </div>
    )
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {post.author?.name && <span className="font-medium">{post.author.name}</span>}
                <time dateTime={post.createdAt.toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </time>
            </div>
            {/* Categories */}
            {post.categories.length > 0 && (
                <div className="flex gap-2 mt-4">
                    {post.categories.map((cat) => (
                        <span key={cat.id} className="bg-secondary/20 px-2 py-1 rounded text-xs">
                            {cat.name}
                        </span>
                    ))}
                </div>
            )}
        </header>

        <div className="prose dark:prose-invert max-w-none">
            {blogSanitizer(post.content || '')}
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
  )
}