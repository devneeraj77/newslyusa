import { MetadataRoute } from 'next'
import db from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://newslyusa.com' // Replace with your actual domain

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
      priority: 0.8,
    },
  ]

  try {
    const posts = await db.post.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        categories: {
          select: {
            name: true,
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5000,
    })

    const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/news/${post.categories[0]?.name || 'general'}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.error('Failed to generate sitemap routes from DB:', error)
    return staticRoutes
  }
}
