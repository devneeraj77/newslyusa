import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsHighlightCardSkeleton } from "@/components/carousels/news-highlight-card";

export default function Loading() {
  return (
    <main className="items-center justify-center m-2">
      <section className="container mx-auto flex flex-col items-center justify-center py-2">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 lg:gap-8 w-full">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-4 w-full">
            <div className="top-4 left-4 z-20 flex justify-between items-center">
              <Skeleton className="h-8 w-40 my-3 ml-2" />
            </div>
            
            {/* Featured Story Skeleton */}
            <div className="relative group overflow-hidden bg-muted shadow-sm aspect-[16/10] md:aspect-[24/10] w-full rounded-md">
              <Skeleton className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-muted/90 via-muted/40 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 space-y-4">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-24 bg-white/20" />
                  <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
                  <Skeleton className="h-4 w-20 bg-white/20" />
                </div>
                <Skeleton className="h-8 md:h-12 w-3/4 bg-white/20" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 bg-white/20" />
                  <Skeleton className="h-6 w-20 bg-white/20" />
                </div>
              </div>
            </div>

            {/* Sub Headlines Skeleton */}
            <div className="md:pt-2 w-full">
              <div className="flex items-center mt-2 mb-4 md:mb-6 pl-4 border-l-4 border-primary">
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 w-full">
                    <Skeleton className="h-20 w-32 md:h-24 md:w-40 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="xl:col-span-1 space-y-2 w-full">
            <hr className="md:hidden mt-2 mb-2" />
            <div className="flex items-center justify-between mt-2 py-2 pt-4">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>

            <div className="flex flex-col gap-1 w-full">
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
        <div className="w-full overflow-hidden">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[350px] flex-1 py-2">
                <Skeleton className="aspect-[16/10] w-full rounded-md" />
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health & Sports Skeleton */}
      <section className="py-2 mx-auto container my-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-4 w-full">
          <div className="md:basis-1/2 space-y-4">
            <Skeleton className="h-8 w-40 m-3 ml-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-video w-full rounded-md" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
          <div className="md:basis-1/2 space-y-4">
            <Skeleton className="h-8 w-40 m-3 ml-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-video w-full rounded-md" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}