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

function formatTimeAgo(dateString: string) {
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

interface NewsHeadlineItem {
  category: string;
  time: string;
  title: string;
  slug: string;
}

export default function NewsHeadlines({
  isLoading: initialLoading = false,
}: {
  isLoading?: boolean;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [headlines, setHeadlines] = useState<NewsHeadlineItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const isLoading = initialLoading || isLoadingData;

  const AUTOPLAY_DURATION = 4000;

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const response = await fetch("/api/news?period=today");
        if (response.ok) {
          const data = await response.json();
          const mappedData = data.map((item: any) => ({
            category: item.categories[0]?.name || "News",
            time: formatTimeAgo(item.createdAt),
            title: item.title,
            slug: item.slug,
          }));
          setHeadlines(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch headlines", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchHeadlines();
  }, []);

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
                        href={`/${item.category}/${item.slug}`}
                        className="block  h-full group"
                      >
                        <article className="relative h-full px-[20px] py-4  flex flex-col justify-between hover:bg-muted/30 transition-colors">
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

// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   type CarouselApi,
// } from "@/components/ui/carousel";
// import { cn } from "@/lib/utils";
// import { Clock, ArrowRight } from "lucide-react";

// const newsItems = [
//   {
//     category: "Crypto",
//     time: "2h ago",
//     title: "Ethereum's New Upgrade Promises to Slash Transaction Fees by 90%",
//     slug: "ethereum-upgrade",
//   },
//   {
//     category: "Market",
//     time: "4h ago",
//     title: "S&P 500 Hits All-Time High as Tech Sector Rallies on AI Optimism",
//     slug: "sp500-all-time-high",
//   },
//   {
//     category: "Policy",
//     time: "5h ago",
//     title: "Global Leaders Agree on Historic Carbon Tax Framework at Summit",
//     slug: "global-carbon-tax",
//   },
//   {
//     category: "Tech",
//     time: "6h ago",
//     title: "Revolutionary Solid-State Battery Ready for Mass Production",
//     slug: "solid-state-battery",
//   },
//   {
//     category: "Startups",
//     time: "8h ago",
//     title: "AI-Powered Healthcare Platform Secures $100M Series B Funding",
//     slug: "ai-healthcare-funding",
//   },
//   {
//     category: "Space",
//     time: "10h ago",
//     title: "NASA Announces Major Discovery of Water on Mars",
//     slug: "mars-water-discovery",
//   },
// ];

// export default function NewsHeadlines() {
//   const [api, setApi] = useState<CarouselApi>();
//   const [current, setCurrent] = useState(0);
//   const [progress, setProgress] = useState(0);

//   const AUTOPLAY_DURATION = 5000;

//   useEffect(() => {
//     if (!api) return;

//     let animationFrameId: number;
//     let startTimestamp: number | null = null;
//     let isPaused = false;

//     const onSelect = () => {
//       setCurrent(api.selectedScrollSnap());
//       startTimestamp = null;
//       setProgress(0);
//     };

//     api.on("select", onSelect);

//     const animate = (timestamp: number) => {
//       if (isPaused) {
//         animationFrameId = requestAnimationFrame(animate);
//         return;
//       }

//       if (!startTimestamp) startTimestamp = timestamp;
//       const elapsed = timestamp - startTimestamp;
//       const newProgress = Math.min((elapsed / AUTOPLAY_DURATION) * 100, 100);

//       setProgress(newProgress);

//       if (elapsed < AUTOPLAY_DURATION) {
//         animationFrameId = requestAnimationFrame(animate);
//       } else {
//         if (api.canScrollNext()) {
//           api.scrollNext();
//         } else {
//           api.scrollTo(0);
//         }
//         startTimestamp = null;
//         setProgress(0);
//         animationFrameId = requestAnimationFrame(animate);
//       }
//     };

//     animationFrameId = requestAnimationFrame(animate);

//     // Pause interactions
//     const pause = () => {
//       isPaused = true;
//     };
//     const resume = () => {
//       isPaused = false;
//       startTimestamp = null;
//       setProgress(0);
//     };

//     const viewport = api.rootNode();
//     if (viewport) {
//       viewport.addEventListener("mouseenter", pause);
//       viewport.addEventListener("mouseleave", resume);
//       viewport.addEventListener("touchstart", pause);
//       viewport.addEventListener("touchend", resume);
//     }

//     return () => {
//       api.off("select", onSelect);
//       cancelAnimationFrame(animationFrameId);
//       if (viewport) {
//         viewport.removeEventListener("mouseenter", pause);
//         viewport.removeEventListener("mouseleave", resume);
//         viewport.removeEventListener("touchstart", pause);
//         viewport.removeEventListener("touchend", resume);
//       }
//     };
//   }, [api]);

//   return (
//     <div className="w-full py-8">
//       <Carousel
//         setApi={setApi}
//         opts={{
//           align: "start",
//           loop: true,
//         }}
//         className="w-full"
//       >
//         <CarouselContent className="-ml-4">
//           {newsItems.map((item, index) => {
//             const isActive = index === current;
//             return (
//               <CarouselItem
//                 key={index}
//                 className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
//               >
//                 <Link href={`/news/${item.slug}`} className="block h-full group">
//                   <article
//                     className={cn(
//                       "relative h-full flex flex-col justify-between p-5 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
//                       "hover:shadow-md hover:border-primary/50",
//                       isActive
//                         ? "ring-1 ring-primary/20 border-primary/20"
//                         : "border-border/50"
//                     )}
//                   >
//                     {/* Progress Bar - Top */}
//                     <div className="absolute top-0 left-0 right-0 h-1 bg-muted/50 rounded-t-lg overflow-hidden">
//                       <div
//                         className={cn(
//                           "h-full bg-primary transition-all ease-linear",
//                           isActive ? "opacity-100" : "opacity-0 w-0"
//                         )}
//                         style={{
//                           width: isActive ? `${progress}%` : "0%",
//                           transitionDuration: isActive ? "100ms" : "0ms",
//                         }}
//                       />
//                     </div>

//                     <div className="space-y-3 mt-2">
//                       <div className="flex items-center justify-between text-xs text-muted-foreground">
//                         <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
//                           {item.category}
//                         </span>
//                         <span className="flex items-center">
//                           <Clock className="mr-1 h-3 w-3" />
//                           {item.time}
//                         </span>
//                       </div>

//                       <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
//                         {item.title}
//                       </h3>
//                     </div>

//                     <div className="pt-4 mt-auto flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
//                       Read more
//                       <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
//                     </div>
//                   </article>
//                 </Link>
//               </CarouselItem>
//             );
//           })}
//         </CarouselContent>
//       </Carousel>
//     </div>
//   );
// }
