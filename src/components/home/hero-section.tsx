"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  IconArrowUpRight,
  IconTrendingUp,
} from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";

import NewsHeadlines, {
  NewsHeadlineItem,
} from "@/components/carousels/news-carousel";
import { TextShimmer } from "@/components/ui/text-shimmer";
import NewsHighlightCard, {
  NewsItem,
  NewsHighlightCardSkeleton,
} from "@/components/carousels/news-highlight-card";
import { Skeleton } from "@/components/ui/skeleton";

const MotionLink = motion.create(Link);

export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${Math.max(0, diffInHours)}H AGO`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}D AGO`;
}

interface HeroSectionProps {
  initialHighlights: NewsItem[];
  initialHeadlines: NewsHeadlineItem[];
}

export default function HeroSection({
  initialHighlights,
  initialHeadlines,
}: HeroSectionProps) {
  const [highlightNews, setHighlightNews] = useState<NewsItem[]>(initialHighlights);
  const [headlines, setHeadlines] = useState<NewsHeadlineItem[]>(initialHeadlines);
  const [featuredPost, setFeaturedPost] = useState<NewsItem | null>(null);

  // Rotate featured post
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

  // If initial props are empty, we might want to fetch (optional, but we assume server passes data)
  // For now, we trust the server data.

  const loadingHighlights = highlightNews.length === 0;

  return (
    <section className="container mx-auto flex flex-col items-center justify-center px-1 py-2">
      <div className="grid grid-cols-1 xl:grid-cols-4 w-full gap-2 lg:gap-4">
        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-2">
          <div className="top-4 left-4 z-20 flex justify-between items-center">
            <span className="pl-2 p-1 my-3 block border-l-2 border-primary w-fit bg-linear-to-r/decreasing from-muted-foreground/10 to-transparent">
              Best of the week
            </span>
          </div>
          {/* Featured Story */}
          <div className="relative group overflow-hidden bg-foreground aspect-[16/10] md:aspect-[24/10]">
            {featuredPost ? (
              <>
                <div className="aspect-[16/10] md:aspect-[24/10] relative w-full overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 " />
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-20% from-black/50 to-transparent p-4 md:p-8 text-white z-20">
                  <div className="flex flex-wrap py-2 gap-2 items-center text-xs md:text-sm ">
                    <Badge variant={"default"} className="">
                      {featuredPost.category}
                    </Badge>
                    <Badge variant={"default"} className="">
                      {formatTimeAgo(featuredPost.createdAt)}
                    </Badge>
                  </div>
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-bold lg:w-2xl font-mono leading-tight mb-4 max-w-4xl drop-shadow-md">
                    {featuredPost.title}
                  </h1>
                  <div className="flex justify-between">
                    <div className="basis-2/3 flex h-auto text-primary/70 flex-wrap gap-3">
                      {(featuredPost.tags && featuredPost.tags.length > 0
                        ? featuredPost.tags
                        : []
                      ).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center text-xs"
                        >
                          <Badge className="truncate text-xs text-primary bg-secondary/10 hover:bg-muted/20 hover:text-primary/90 cursor-pointer">
                            <span className="">#</span>
                            {tag.name}
                          </Badge>
                        </span>
                      ))}
                    </div>
                    <motion.div
                      initial={{ y: -100, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 800,
                        damping: 150,
                        duration: 2,
                      }}
                      className="group opacity-100"
                    >
                      <MotionLink
                        href={`/${featuredPost.categorySlug}/${featuredPost.slug}`}
                        className="p-2 flex w-fit gap-2 items-center bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-full font-bold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 800,
                          damping: 150,
                        }}
                      >
                        <IconArrowUpRight className="" size={24} />
                      </MotionLink>
                    </motion.div>
                  </div>{" "}
                </div>
              </>
            ) : (
              <div className="relative bg-black w-screen lg:w-5xl aspect-[16/10] md:aspect-[24/10]">
                <Skeleton className="h-full w-full " />
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
          <div className="md:pt-2 mt-4 h-44">
            {headlines.length > 0 ? (
              <div className="flex items-center justify-start my-4 mt-2 md:mb-4 gap-1 border-primary">
                <TextShimmer as="h2" className="text-xl tracking-tight">
                  Top headlines
                </TextShimmer>
                <IconTrendingUp className="text-primary/80" size={24} />
              </div>
            ) : (
              <div className="flex items-center justify-start gap-1 mt-2 md:mb-4 border-destructive">
                <TextShimmer as="h2" className="text-xl tracking-tight">
                  No headlines yet
                </TextShimmer>
                <IconTrendingUp className="text-primary/80" size={24} />
              </div>
            )}
            {headlines.length > 0 && (
              <NewsHeadlines headlines={headlines} isLoading={false} />
            )}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="xl:col-span-1 space-y-2">
          <hr className="md:hidden mb-2" />
          <div className="flex items-center justify-between py-2 pt-4">
            <span className="font-bold text-lg pl-2">Highlights</span>
            <button className="flex md:pr-0 pr-2 items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1">
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex flex-col pr-2 gap-1 lg:max-h-154 overflow-y-scroll">
            {loadingHighlights
              ? [...Array(6)].map((_, i) => (
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
  );
}
