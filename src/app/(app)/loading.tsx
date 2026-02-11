import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsHighlightCardSkeleton } from "@/components/carousels/news-highlight-card";
import { NewsHeadlineSkeleton } from "@/components/carousels/news-carousel";

export default function Loading() {
  return (
    <main className="items-center justify-center m-2">
      <section className="container mx-auto flex flex-col items-center justify-center px-1 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-7 w-full gap-3">
          {/* Main Content Area */}
          <div className="xl:col-span-5 space-y-4 lg:space-y-6">
            <div className="top-4 left-4 z-20 flex justify-between items-center">
              <span className="pl-2 p-1 my-3 block border-l-2 border-primary w-fit bg-linear-to-r/decreasing from-muted-foreground/10 to-transparent">
                <Skeleton className="h-6 w-32 bg-transparent" />
              </span>
            </div>

            {/* Featured Story Skeleton */}
            <div className="relative group overflow-hidden bg-foreground aspect-[16/10] md:aspect-[24/10]">
              <div className="relative bg-black w-screen lg:w-5xl aspect-[16/10] md:aspect-[24/10]">
                <Skeleton className="h-full w-full " />
                <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 space-y-4">
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-5 w-20 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                  <Skeleton className="h-8 md:h-12 w-3/4 bg-white/20" />
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
                      <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
                    </div>
                    <Skeleton className="h-8 w-32 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Headlines Skeleton */}
            <div className="md:pt-2 mt-2 min-h-[11rem]">
              <div className="flex items-center justify-start my-4 mt-2 md:mb-4 gap-1">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="w-full">
                <div className="flex gap-4 overflow-hidden">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3 border-r last:border-r-0 border-dashed border-border/60"
                    >
                      <NewsHeadlineSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="xl:col-span-2 space-y-2">
            <hr className="md:hidden mb-2" />
            <div className="flex items-center justify-between py-2 pt-4 ">
              <Skeleton className="h-7 w-24 pl-2" />
              <Skeleton className="h-5 w-16 pr-2" />
            </div>

            <div className="flex flex-col pr-2 gap-1 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <NewsHighlightCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="border m-4 md:mx-16 lg:mx-17 border-dashed" />

      {/* Editor's Pick Skeleton */}
      <section className="py-2 mx-auto container my-2">
        <div className="flex">
          <span className="pl-3 py-1 m-2 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10 to-transparent">
             <Skeleton className="h-6 w-32 bg-transparent" />
          </span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row mx-auto items-center justify-between sm:items-start">
          <div className="w-full overflow-hidden">
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="m-2 py-2 min-w-[280px] flex-1">
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
                    <div className="pt-4 flex justify-between items-center">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Health & Sports Skeleton */}
      <section className="py-2 mx-auto border container my-8">
        <div className="md:flex gap-4">
          <div className="md:basis-1/2">
             <span className="pl-3 py-1 m-2 mb-4 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10 to-transparent">
                 <Skeleton className="h-6 w-32 bg-transparent" />
            </span>
            <div className="w-full p-2">
              <div className="overflow-hidden">
                <div className="flex -ml-4">
                  <div className="flex-[0_0_100%] min-w-0 pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[5/3] relative overflow-hidden"
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
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="md:basis-1/2">
             <span className="pl-3 py-1 m-2 mb-4 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10 to-transparent">
                 <Skeleton className="h-6 w-32 bg-transparent" />
            </span>
            <div className="w-full p-2">
              <div className="overflow-hidden">
                <div className="flex -ml-4">
                  <div className="flex-[0_0_100%] min-w-0 pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[5/3] relative overflow-hidden"
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
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More News Skeleton */}
      <section className="py-2 mx-auto container my-2">
        <div className="flex">
           <span className="pl-3 py-1 m-2 block border-l-2 border-primary/70 w-fit bg-linear-to-r/decreasing from-muted-foreground/10 to-transparent">
                 <Skeleton className="h-6 w-32 bg-transparent" />
            </span>
        </div>
        <div className="mx-auto p-2 font-sans text-popover-foreground">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-2 pb-6 border-dashed border-b">
            {/* Main Content Area Skeleton (Spans 9 cols) */}
            <div className="lg:col-span-9 flex flex-col gap-8">
              {/* Article 1 Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 order-2 md:order-1 flex flex-col gap-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="md:col-span-2 order-1 md:order-2">
                  <Skeleton className="aspect-[16/9] w-full" />
                </div>
              </div>

              {/* Bottom Section Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-dashed border-t">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="aspect-video w-full mb-1" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-2 w-10" />
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-2 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Skeleton (Spans 3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-6 lg:pl-2 border-primary/5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton
                    className={`aspect-video w-full mb-1 ${i > 0 ? "lg:hidden" : ""}`}
                  />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-12" />
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                  {i < 2 && <hr className="w-full border-dashed my-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}