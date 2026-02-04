"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const NewsHeadlineSkeleton = () => (
  <div className="relative h-full px-[20px] py-4 flex flex-col justify-between">
    <div className="space-y-3 w-full">
      <Skeleton className="w-12 h-1 rounded-full bg-muted-foreground/20" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12 bg-muted-foreground/20" />
          <Skeleton className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          <Skeleton className="h-3 w-10 bg-muted-foreground/20" />
        </div>
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-2/3 bg-muted-foreground/20" />
      </div>
    </div>
  </div>
);

// function formatTimeAgo(dateString: string) {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInMs = now.getTime() - date.getTime();
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInHours < 24) {
//     return `${Math.max(0, diffInHours)}h ago`;
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   return `${diffInDays}d ago`;
// }

export interface NewsHeadlineItem {
  id?: string;
  category: string;
  time: string;
  title: string;
  slug: string;
  categorySlug: string;
}

interface NewsHeadlinesProps {
  isLoading?: boolean;
  headlines: NewsHeadlineItem[];
}

export default function NewsHeadlines({
  isLoading = false,
  headlines = [],
}: NewsHeadlinesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const AUTOPLAY_DURATION = 4000;

  useEffect(() => {
    if (!api || isLoading) return;

    let animationFrameId: number;
    let startTimestamp: number | null = null;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      // Reset timer on slide change (whether manual or auto)
      startTimestamp = null;
      setProgress(0);
    };

    api.on("select", onSelect);

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const newProgress = Math.min((elapsed / AUTOPLAY_DURATION) * 100, 100);

      setProgress(newProgress);

      if (elapsed < AUTOPLAY_DURATION) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
        // Reset for next slide
        startTimestamp = null;
        setProgress(0);
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      api.off("select", onSelect);
      cancelAnimationFrame(animationFrameId);
    };
  }, [api, isLoading]);

  const itemsToRender = headlines;

  if (!isLoading && itemsToRender.length === 0) {
    return null;
  }

  return (
    <div className="w-full  bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl ">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {isLoading
              ? [...Array(6)].map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3 border-r last:border-r-0 border-dashed border-border/60"
                  >
                    <NewsHeadlineSkeleton />
                  </CarouselItem>
                ))
              : itemsToRender.map((item, index) => {
                  const isActive = index === current;
                  return (
                    <CarouselItem
                      key={index}
                      className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3 border-r last:border-r-0 border-dashed border-border/60"
                    >
                      <Link
                        href={`/${item.categorySlug}/${item.slug}`}
                        className="block  h-full group"
                      >
                        <article className="relative h-full px-4 py-4  flex flex-col justify-between hover:bg-muted/10 transition-colors">
                          <div className="space-y-3">
                            {/* Progress Bar Container */}
                            <div className="w-12 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full bg-primary rounded-full transition-all duration-75 ease-linear",
                                  isActive ? "opacity-100" : "opacity-0 w-0"
                                )}
                                style={{
                                  width: isActive ? `${progress}%` : "0%",
                                }}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                <span className="text-primary">
                                  {item.category}
                                </span>
                                <span>•</span>
                                <span>{item.time}</span>
                              </div>
                              <h3 className="text-sm font-medium leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          {/* Hover hint */}
                          <div className="absolute top-4 right-4 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </article>
                      </Link>
                    </CarouselItem>
                  );
                })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
