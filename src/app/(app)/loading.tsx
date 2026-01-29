import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsHighlightCardSkeleton } from "@/components/carousels/news-highlight-card";
import { NewsHeadlineSkeleton } from "@/components/carousels/news-carousel";

export default function Loading() {
  return (
    <main className="items-center justify-center m-2">
      <section className="container mx-auto flex flex-col items-center justify-center py-2">
        <div className="grid grid-cols-1 xl:grid-cols-4 w-full gap-2 lg:gap-4">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-2">
            <div className="top-4 left-4 z-20 flex justify-between items-center">
              <Skeleton className="h-8 w-40 my-3 ml-2" />
            </div>

            {/* Featured Story Skeleton */}
            <div className="relative group overflow-hidden bg-foreground aspect-[16/10] md:aspect-[24/10]">
              <div className="relative bg-black w-full h-full">
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
            </div>

            {/* Sub Headlines Skeleton */}
            <div className="md:pt-2 h-44">
              <div className="flex items-center mt-2  md:mb-4 border pl-4  border-l-4 border-primary">
                <Skeleton className="h-8 w-32" />
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
          <div className="xl:col-span-1 space-y-2">
            <hr className="md:hidden mb-2" />
            <div className="flex items-center justify-between py-2 pt-4 ">
              <Skeleton className="h-7 w-24 pl-2" />
              <Skeleton className="h-5 w-16 pr-2" />
            </div>

            <div className="flex flex-col pr-2 gap-1 lg:max-h-154 overflow-hidden">
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
          <Skeleton className="h-8 w-40 m-3 ml-2" />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row mx-auto items-center justify-between sm:items-start">
          <div className="w-full">
            <div className="flex overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="m-2 py-2 min-w-[300px] flex-1">
                  <Skeleton className="aspect-[16/10] w-full " />
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="px-2 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="pt-4 px-2 flex justify-between items-center">
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
      <section className="py-2 mx-auto container my-8">
        <div className="md:flex gap-4">
          <div className="md:basis-1/2">
            <Skeleton className="h-8 w-40 m-2 mb-4 block" />
            <div className="w-full p-3">
              <div className="overflow-hidden">
                <div className="flex -ml-4">
                  <div className="flex-[0_0_100%] min-w-0 pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] relative overflow-hidden"
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
          </div>
          <div className="md:basis-1/2">
            <Skeleton className="h-8 w-40 m-2 mb-4 block" />
            <div className="w-full p-3">
              <div className="overflow-hidden">
                <div className="flex -ml-4">
                  <div className="flex-[0_0_100%] min-w-0 pl-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[4/3] relative overflow-hidden"
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
          </div>
        </div>
      </section>

      {/* More News Skeleton */}
      <section className="py-2 mx-auto container my-2">
        <div className="flex">
          <Skeleton className="h-8 w-40 m-3 ml-2" />
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-video w-full " />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
