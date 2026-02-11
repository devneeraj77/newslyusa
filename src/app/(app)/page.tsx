import React from "react";
import HomeClient from "@/components/home-client";
import { formatTimeAgo } from "@/lib/utils";
import db from "@/lib/prisma";

export const revalidate = 60;

export default async function Home() {
  const [
    highlightsData,
    headlinesData,
    editorsPickData,
    healthRawData,
    sportsRawData,
  ] = await Promise.all([
    // highlights: limit=6
    db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { categories: true, tags: true },
    }),
    // headlines: period=today
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return db.post.findMany({
        where: { published: true, createdAt: { gte: today } },
        orderBy: { createdAt: "desc" },
        include: { categories: true, tags: true },
      });
    })(),
    // editorsPick: isEditorsPick=true&limit=10
    db.post.findMany({
      where: { published: true, isEditorsPick: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { categories: true, tags: true },
    }),
    // health news
    (async () => {
      const category = await db.category.findUnique({ where: { slug: "health" } });
      if (!category) return [];
      return db.post.findMany({
        where: { published: true, categoryIds: { has: category.id } },
        orderBy: { createdAt: "desc" },
        include: { categories: true },
      });
    })(),
    // sports news
    (async () => {
      const category = await db.category.findUnique({ where: { slug: "sports" } });
      if (!category) return [];
      return db.post.findMany({
        where: { published: true, categoryIds: { has: category.id } },
        orderBy: { createdAt: "desc" },
        include: { categories: true },
      });
    })(),
  ]);

  const highlights = highlightsData.map((post: any) => ({
    id: post.id,
    title: post.title,
    image: post.image || "https://placehold.co/600x400/00000/ffffff/png",
    category: post.categories.length > 0 ? post.categories[0].name : "news",
    categorySlug:
      post.categories.length > 0 ? post.categories[0].slug : "news",
    timestamp: new Date(post.createdAt).toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    slug: post.slug,
    content: post.content,
    categories: post.categories,
    tags: post.tags,
    createdAt: post.createdAt.toISOString(),
  }));

  const headlines = headlinesData.map((item: any) => ({
    id: item.id,
    category: item.categories[0]?.name || "News",
    time: formatTimeAgo(item.createdAt),
    title: item.title,
    slug: item.slug,
    categorySlug: item.categories[0]?.slug || "news",
  }));

  const editorsPick = editorsPickData.map((post: any) => ({
    id: post.id,
    title: post.title,
    image: post.image || "https://placehold.co/600x400/00000/ffffff/png",
    category: post.categories.length > 0 ? post.categories[0].name : "news",
    categorySlug: post.categories[0]?.slug || "news",
    timestamp: new Date(post.createdAt).toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    slug: post.slug,
    content: post.content,
    categories: post.categories,
    tags: post.tags,
    createdAt: post.createdAt.toISOString(),
  }));

  // Helper to map category news
  const mapCategoryNews = (posts: any[], categoryName: string, categorySlug: string) => {
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      image: post.image || "https://placehold.co/600x400/00000/ffffff/png",
      category: post.categories?.[0]?.name || categoryName,
      timestamp: formatTimeAgo(post.createdAt),
      slug: post.slug,
      categorySlug: post.categories?.[0]?.slug || categorySlug,
    }));
  };

  const healthData = mapCategoryNews(healthRawData, "Health", "health");
  const sportsData = mapCategoryNews(sportsRawData, "Sports", "sports");

  // Calculate initial featured post
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekPosts = highlights.filter(
    (post: any) => new Date(post.createdAt) >= oneWeekAgo
  );
  const pool = weekPosts.length > 0 ? weekPosts : highlights;
  let initialFeaturedPost = null;
  if (pool.length > 0) {
    const hour = now.getHours();
    initialFeaturedPost = pool[hour % pool.length];
  }

  return (
    <HomeClient
      initialHighlights={highlights}
      initialHeadlines={headlines}
      initialEditorsPick={editorsPick}
      initialHealthNews={healthData}
      initialSportsNews={sportsData}
      initialFeaturedPost={initialFeaturedPost}
    />
  );
}
