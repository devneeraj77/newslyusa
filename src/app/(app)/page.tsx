import React from "react";
import HomeClient from "@/components/home-client";
import { formatTimeAgo } from "@/lib/utils";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL;
  return `http://localhost:${process.env.PORT || 3000}`;
};

async function fetchNews(params: string) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/news?${params}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

async function fetchCategoryNews(category: string) {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/news/category?slug=${category}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((post: any) => ({
      id: post.id,
      title: post.title,
      image: post.image || "https://placehold.co/600x400/00000/ffffff/png",
      category: post.categories?.[0]?.name || category,
      timestamp: formatTimeAgo(post.createdAt),
      slug: post.slug,
      categorySlug: post.categories?.[0]?.slug || category.toLowerCase(),
    }));
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
}

export default async function Home() {
  const [
    highlightsData,
    headlinesData,
    editorsPickData,
    healthData,
    sportsData,
  ] = await Promise.all([
    fetchNews("limit=6"),
    fetchNews("period=today"),
    fetchNews("isEditorsPick=true&limit=10"),
    fetchCategoryNews("health"),
    fetchCategoryNews("sports"),
  ]);

  const highlights = highlightsData.map((post: any) => ({
    id: post.id,
    title: post.title,
    image: post.image || "https://placehold.co/600x400/00000/ffffff/png",
    category: post.categories.length > 0 ? post.categories[0].name : "General",
    categorySlug:
      post.categories.length > 0 ? post.categories[0].slug : "general",
    timestamp: new Date(post.createdAt).toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    slug: post.slug,
    content: post.content,
    categories: post.categories,
    tags: post.tags,
    createdAt: post.createdAt,
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
    image: post.image,
    category: post.categories.length > 0 ? post.categories[0].name : "General",
    categorySlug:
      post.categories.length > 0 ? post.categories[0].slug : "general",
    timestamp: new Date(post.createdAt).toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    slug: post.slug,
    content: post.content,
    categories: post.categories,
    tags: post.tags,
    createdAt: post.createdAt,
  }));

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
