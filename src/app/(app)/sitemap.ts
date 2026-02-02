import { MetadataRoute } from 'next'
import db from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://newslyusa.com'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Fetch Categories
    const categories = await db.category.findMany({
      select: {
        slug: true,
      },
    })

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))

    // Fetch Tags
    const tags = await db.tag.findMany({
      select: {
        name: true,
      },
    })

    const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${baseUrl}/tags/${slugify(tag.name)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    // Fetch Posts
    const posts = await db.post.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        image: true,
        categories: {
          select: {
            slug: true,
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10000, // Limit to prevent timeout/memory issues
    })

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
      const categorySlug = post.categories[0]?.slug || 'news'
      return {
        url: `${baseUrl}/${categorySlug}/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'daily',
        priority: 0.7,
        images: post.image ? [post.image] : undefined,
      }
    })

    return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...postRoutes]
  } catch (error) {
    console.error('Failed to generate sitemap routes from DB:', error)
    return staticRoutes
  }
}

