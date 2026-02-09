"use client";

import React, { useEffect, useState } from "react";

import EmblaCarouselAutoplay from "@/components/carousels/embla-carousel";
import { Dot, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import {
  IconArrowNarrowRight,
  IconArrowRight,
  IconArrowUpRight,
  IconHash,
  IconTrendingUp,
} from "@tabler/icons-react";
import NewsHeadlines, {
  NewsHeadlineItem,
} from "@/components/carousels/news-carousel";
import EmblaTwoRow from "@/components/carousels/embla-two-row";
import MoreNewsBentoGrid from "@/components/carousels/more-news-bento-grid";
import { TextShimmer } from "@/components/ui/text-shimmer";
import NewsHighlightCard, {
  FALLBACK_HIGHLIGHTS,
  NewsItem,
  NewsHighlightCardSkeleton,
} from "@/components/carousels/news-highlight-card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";


const OPTIONS: EmblaOptionsType = { loop: true };

const MOCK_NEWS_DATA = [
  {
    id: "1",
    title: "Global Markets Rally as Tech Stocks Hit New Highs",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1445&auto=format&fit=crop",
    category: "Finance",
    timestamp: "2 hours ago",
    slug: "global-markets-rally",
    categorySlug: "finance",
  },
  {
    id: "2",
    title: "Breakthrough in Renewable Energy Storage Announced",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1470&auto=format&fit=crop",
    category: "Technology",
    timestamp: "4 hours ago",
    slug: "renewable-energy-storage",
    categorySlug: "technology",
  },
  {
    id: "3",
    title: "New Art Exhibition Opens in Downtown Gallery",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1445&auto=format&fit=crop",
    category: "Culture",
    timestamp: "5 hours ago",
    slug: "new-art-exhibition",
    categorySlug: "culture",
  },
  {
    id: "4",
    title: "Local Sports Team Secures Championship Title",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1470&auto=format&fit=crop",
    category: "Sports",
    timestamp: "6 hours ago",
    slug: "local-sports-team",
    categorySlug: "sports",
  },
  {
    id: "5",
    title: "The Future of AI: Trends to Watch in 2026",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
    category: "Tech",
    timestamp: "1 hour ago",
    slug: "future-of-ai",
    categorySlug: "tech",
  },
  {
    id: "6",
    title: "Sustainable Fashion: A Growing Trend",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1470&auto=format&fit=crop",
    category: "Lifestyle",
    timestamp: "3 hours ago",
    slug: "sustainable-fashion",
    categorySlug: "lifestyle",
  },
];

// function formatTimeAgo(dateString: string) {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInMs = now.getTime() - date.getTime();
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInHours < 24) {
//     return `${Math.max(0, diffInHours)}H AGO`;
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays}D AGO`;
// }

export default function Home() {
  const [highlightNews, setHighlightNews] = useState<NewsItem[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<NewsItem | null>(null);

  const [editorsPickNews, setEditorsPickNews] = useState<NewsItem[]>([]);
  const [loadingEditorsPick, setLoadingEditorsPick] = useState(true);

  const [healthNews, setHealthNews] = useState<any[]>(MOCK_NEWS_DATA);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [sportsNews, setSportsNews] = useState<any[]>(MOCK_NEWS_DATA);
  const [loadingSports, setLoadingSports] = useState(true);

  const [headlines, setHeadlines] = useState<NewsHeadlineItem[]>([]);
  const [loadingHeadlines, setLoadingHeadlines] = useState(true);

  useEffect(() => {
    const fetchHeadlines = async () => {
      setLoadingHeadlines(true);
      try {
        const response = await fetch("/api/news?period=today");
        if (response.ok) {
          const data = await response.json();
          const mappedData = data.map((item: any) => ({
            id: item.id,
            category: item.categories[0]?.name || "News",
            time: formatTimeAgo(item.createdAt),
            title: item.title,
            slug: item.slug,
            categorySlug: item.categories[0]?.slug || "news",
          }));
          setHeadlines(mappedData);
        } else {
          setHeadlines([]);
        }
      } catch (error) {
        console.error("Failed to fetch headlines", error);
        setHeadlines([]);
      } finally {
        setLoadingHeadlines(false);
      }
    };

    fetchHeadlines();
  }, []);

  useEffect(() => {
    const fetchCategoryNews = async (
      category: string,
      setter: React.Dispatch<React.SetStateAction<any[]>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      setLoading(true);
      try {
        const fetchUrl = `/api/news/category?slug=${category.toLowerCase()}`;
        // console.log(`Fetching category news from: ${fetchUrl}`);
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          console.error(
            `HTTP error! status: ${response.status} for ${category} news`,
          );
          setter([]); // Set to empty array on HTTP error
          return;
        }

        const data = await response.json();
        // console.log(`Received data for ${category}:`, data);

        if (data.length > 0) {
          const transformed = data.map((post: any) => ({
            id: post.id,
            title: post.title,
            image:
              post.image || "https://placehold.co/600x400/00000/ffffff/png",
            category: post.categories?.[0]?.name || category,
            timestamp: formatTimeAgo(post.createdAt),
            slug: post.slug,
            categorySlug: post.categories?.[0]?.slug || category.toLowerCase(),
          }));
          setter(transformed);
        } else {
          // console.log(
          //   `No data received for ${category}. Setting to empty array.`,
          // );
          setter([]); // Set to empty array if no data
        }
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
        setter([]); // Set to empty array on fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews("Health", setHealthNews, setLoadingHealth);
    fetchCategoryNews("Sports", setSportsNews, setLoadingSports);
  }, []);

  useEffect(() => {
    if (highlightNews.length === 0) return;

    const updateFeatured = () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const weekPosts = highlightNews.filter(
        (post) => new Date(post.createdAt) >= oneWeekAgo,
      );
      const pool = weekPosts.length > 0 ? weekPosts : highlightNews;

      if (pool.length > 0) {
        const hour = now.getHours();
        setFeaturedPost(pool[hour % pool.length]);
      }
    };

    updateFeatured();
    const interval = setInterval(updateFeatured, 60 * 1000);
    return () => clearInterval(interval);
  }, [highlightNews]);

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoadingHighlights(true);
      try {
        const response = await fetch("/api/news?limit=6"); // Fetch up to 10 highlights
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const transformedData: NewsItem[] = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          image: post.image || "https://placehold.co/600x400/00000/ffffff/png", // Default image
          category:
            post.categories.length > 0 ? post.categories[0].name : "General",
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

        if (transformedData.length === 0) {
          setHighlightNews(FALLBACK_HIGHLIGHTS);
        } else {
          setHighlightNews(transformedData);
        }
      } catch (err) {
        console.error("Error fetching highlights:", err);
        setHighlightNews(FALLBACK_HIGHLIGHTS);
      } finally {
        setLoadingHighlights(false);
      }
    };
    fetchHighlights();
  }, []);

  useEffect(() => {
    const fetchEditorsPick = async () => {
      setLoadingEditorsPick(true);
      try {
        const response = await fetch("/api/news?isEditorsPick=true&limit=10");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const transformedData: NewsItem[] = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          image: post.image,
          category:
            post.categories.length > 0 ? post.categories[0].name : "General",
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

        setEditorsPickNews(transformedData);
      } catch (err) {
        console.error("Error fetching editors pick:", err);
      } finally {
        setLoadingEditorsPick(false);
      }
    };
    fetchEditorsPick();
  }, []);

  const handleAnimationComplete = () => {
    // Animation complete callback
    console.log("Animation complete!");
  };

  const filteredHeadlines = headlines.filter(
    (h) => h.id !== featuredPost?.id
  );

  return (
    <main className="items-center justify-center  m-2 ">
      <section className="container mx-auto flex flex-col items-center justify-center px-1 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-7 w-full gap-3 ">
          {/* Main Content Area */}
          <div className="xl:col-span-5 space-y-4 lg:space-y-6">
            <div className="flex items-center justify-between">
              <span className="pl-2 p-1 my-2 block border-l-2 border-primary w-fit bg-linear-to-r/decreasing from-muted-foreground/10 to-transperant">
                Best of the week
              </span>
            </div>

            {/* Featured Story */}
            <div className="relative overflow-hidden bg-foreground/5">
              {featuredPost ? (
                <>
                  <div className="relative aspect-[16/10] md:aspect-[24/10] w-full overflow-hidden">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1279px) 100vw, 1100px"
                      className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 text-white z-10">
                    <div className="flex flex-wrap gap-3 items-center mb-2">
                      <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none px-3 py-1">
                        {featuredPost.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-white/90 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        {formatTimeAgo(featuredPost.createdAt)}
                      </div>
                    </div>

                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold tracking-tight leading-tight  md:mb-2 max-w-4xl drop-shadow-lg text-white">
                      {featuredPost.title}
                    </h1>

                    <div className="flex items-end justify-between gap-4">
                      <div className="flex flex-wrap gap-2 max-w-2xl">
                        {(featuredPost.tags && featuredPost.tags.length > 0
                          ? featuredPost.tags
                          : []
                        )
                          .slice(0, 3)
                          .map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="ghost"
                              className=" bg-white/5 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                            >
                              <IconHash size={22} />
                              {tag.name}
                            </Badge>
                          ))}
                      </div>
                      <Link
                        href={`/${featuredPost.categorySlug}/${featuredPost.slug}`}
                        className="group  flex items-center gap-2 md:bg-white text-black hover:bg-gray-100 rounded-full pl-4 md:pr-1.5 md:py-1.5 font-semibold transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                        aria-label={`Read ${featuredPost.title}`}
                      >
                        <span className="text-sm hidden md:block">Read Article</span>
                        <div className="text-primary bg-secondary md:bg-black md:text-white p-3 md:p-1.5 rounded-full group-hover:rotate-45 transition-transform duration-300">
                          <IconArrowUpRight  size={20} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative aspect-[16/10] md:aspect-[24/10]">
                  <Skeleton className="h-full w-full" />
                  <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 space-y-4">
                    <div className="flex gap-2 items-center">
                      <Skeleton className="h-4 w-24 bg-white/20" />
                      <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
                      <Skeleton className="h-4 w-20 bg-white/20" />
                    </div>
                    <Skeleton className="h-12 w-3/4 bg-white/20" />
                    <div className="flex gap-2 pb-2 md:pb-4">
                      <Skeleton className="h-6 w-20 bg-white/20" />
                      <Skeleton className="h-6 w-20 bg-white/20" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sub Headlines */}
            <div className="md:pt-2 mt-2 min-h-[11rem]">
              {loadingHeadlines ? (
                <Skeleton className="h-8 w-32" />
              ) : filteredHeadlines.length > 0 ? (
                <div className="flex items-center justify-start my-4 mt-2 md:mb-4 gap-1 border-primary">
                  <TextShimmer as="h2" className="text-xl tracking-tight">
                    Top headlines
                  </TextShimmer>
                  <IconTrendingUp className="text-primary/80" size={24} />
                </div>
              ) : (
                <div className="flex items-center justify-star gap-1 mt-2 md:mb-4 border-destructive">
                  <TextShimmer as="h2" className="text-xl tracking-tight">
                    No headlines for yet
                  </TextShimmer>
                  <IconTrendingUp className="text-primary/80" size={24} />
                </div>
              )}
              {(loadingHeadlines || filteredHeadlines.length > 0) && (
                <NewsHeadlines
                  headlines={filteredHeadlines}
                  isLoading={loadingHeadlines}
                />
              )}
            </div>
          </div>
          {/* Sidebar Area */}
          <div className="xl:col-span-2 space-y-2">
            <hr className="md:hidden mb-2" />
            <div className="flex items-center justify-between py-2 pt-4">
              <span className="font-bold text-lg pl-2">Highlights</span>
              <button className="flex md:pr-0 pr-2 items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1">
                View all <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex flex-col pr-2 gap-1  overflow-y-auto">
              {loadingHighlights
                ? [...Array(5)].map((_, i) => (
                    <NewsHighlightCardSkeleton key={i} />
                  ))
                : highlightNews
                    .filter((news) => news.id !== featuredPost?.id)
                    .map((news) => (
                      <NewsHighlightCard key={news.id} news={news} />
                    ))}
            </div>
          </div>
        </div>
      </section>
      <hr className="border m-4 md:mx-16 lg:mx-17  border-dashed" />
      <section className=" py-2 mx-auto container my-2">
        <div className="flex">
          <p className="pl-3 py-1 md:tex-xl lg:text-xl m-2 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10  to-transperant">
            Editor's pick
          </p>
        </div>
        <div className=" flex flex-col gap-4 lg:flex-row mx-auto flex-col items-center justify-between    sm:items-start">
          <div className="w-full">
            {loadingEditorsPick ? (
              <EmblaCarouselAutoplay
                slides={[...Array(4)].map((_, i) => (
                  <div key={i} className="m-2 py-2">
                    <Skeleton className="aspect-[16/10] w-full " />
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className=" space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="pt-4  flex justify-between items-center">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              />
            ) : (
              <EmblaCarouselAutoplay
                slides={editorsPickNews.map((news, i) => (
                  <Link
                    key={news.id}
                    href={`/${news.categorySlug}/${news.slug}`}
                    className="group block w-full h-full"
                  >
                    <div className="m-2 py-2">
                      <div className="relative aspect-[16/10] overflow-hidden ">
                        <Image
                          src={
                            news.image ||
                            "https://placehold.co/600x400/00000/ffffff/png"
                          }
                          fill
                          fetchPriority={i < 2 ? "high" : "auto"}
                          priority={i < 2}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300  hover:scale-105"
                          alt={news.title}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-popover-foreground flex justify-start items-center  mt-2">
                          <span className="uppercase font-semibold ">
                            {news.category}
                          </span>
                          <Dot className="" size={24} />
                          <span>{formatTimeAgo(news.createdAt)}</span>
                        </div>
                        <h4 className="text-sm sm:text-md  text-primary font-semibold decoration-1 group-hover:underline underline-offset-4 mb-3 decoration-shade line-clamp-2 mt-1">
                          {news.title}
                        </h4>
                      </div>
                      <div className="text-sm  pt-4 flex justify-between hover:text-shade items-center text-muted-foreground hover:text-primary transition-colors">
                        <p>Read More</p>
                        <div className=" left-0 bottom-4  hover:text-shade opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <IconArrowUpRight
                            size={24}
                            className="hover:text-shade transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              />
            )}
          </div>
        </div>
      </section>
      <section className="py-2 mx-auto container my-8">
        <div className="md:flex  gap-4">
          <div className="md:basis-1/2 ">
            <p className="pl-3 py-1 md:tex-xl lg:text-xl m-2 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10  to-transperant">
              Health News
            </p>
            {loadingHealth ? (
              <div className="w-full p-3">
                <div className="overflow-hidden">
                  <div className="flex -ml-4">
                    <div className="flex-[0_0_100%] min-w-0 pl-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => (
                          <div
                            key={i}
                            className="aspect-[5/3] relative  overflow-hidden"
                          >
                            <Skeleton className="h-full w-full" />
                            <div className="absolute inset-0 p-2 flex flex-col justify-end">
                              <div className="flex items-center mb-2 gap-2">
                                <Skeleton className="h-3 w-12 bg-white/20" />
                                <Skeleton className="h-3 w-3 rounded-full bg-white/20" />
                                <Skeleton className="h-3 w-10 bg-white/20" />
                              </div>
                              <Skeleton className="h-6 w-full bg-white/20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-8 px-2">
                  <div className="flex gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              <EmblaTwoRow slides={healthNews} options={OPTIONS} />
            )}
          </div>
          <div className="md:basis-1/2  ">
            <p className="pl-3 py-1 md:tex-xl lg:text-xl m-2 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10  to-transperant">
              Sports News
            </p>

            {loadingSports ? (
              <div className="w-full p-3">
                <div className="overflow-hidden">
                  <div className="flex -ml-4">
                    <div className="flex-[0_0_100%] min-w-0 pl-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => (
                          <div
                            key={i}
                            className="aspect-[5/3] relative  overflow-hidden"
                          >
                            <Skeleton className="h-full w-full" />
                            <div className="absolute inset-0 p-2 flex flex-col justify-end">
                              <div className="flex items-center mb-2 gap-2">
                                <Skeleton className="h-3 w-12 bg-white/20" />
                                <Skeleton className="h-3 w-3 rounded-full bg-white/20" />
                                <Skeleton className="h-3 w-10 bg-white/20" />
                              </div>
                              <Skeleton className="h-6 w-full bg-white/20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-8 px-2">
                  <div className="flex gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              <EmblaTwoRow slides={sportsNews} options={OPTIONS} />
            )}
          </div>
        </div>
      </section>
      <section className=" py-2 mx-auto container my-2">
        <div className="flex">
          <p className="pl-3 py-1 md:tex-xl lg:text-xl m-2 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10  to-transperant">
            More News
          </p>
        </div>
        <div className=" flex flex-col gap-4 lg:flex-row mx-auto flex-col items-center justify-between     sm:items-start">
          <div className="w-full">
            <MoreNewsBentoGrid />
          </div>
        </div>
      </section>
      <section className="min-h-90 flex items-center">
        <div className="border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-10 sm:px-16">
          <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-16 sm:py-20 -mt-10 -mb-10 w-full">
            <p className="text-xl font-medium max-w-md text-foreground font-extrabold ">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Explicabo, tempora!
            </p>
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold rounded-md py-3 px-8 bg-accent text-accent-foreground hover:text-primary hover:bg-shade  transition "
            >
              <span>Stay updated on daily life</span>
              <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
