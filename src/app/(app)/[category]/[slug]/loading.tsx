import { SimilarPostsSkeleton } from "@/components/similar-posts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="basis-3/2">
          <div className="max-w-4xl">
            {/* Breadcrumb Skeleton */}
            <div className="mt-4 mb-4">
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Title Skeleton */}
            <Skeleton className="h-8 xs:h-9 sm:h-14 w-3/4 my-10" />

            {/* Author/Meta Skeleton */}
            <div className="flex items-end justify-between">
              <div className="flex pt-4 gap-2 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>

            {/* Content Skeleton */}
            <div className="mt-8">
              {/* Image */}
              <Skeleton className="relative aspect-[17/12] md:aspect-[17/7] w-full mb-8" />

              {/* Text lines */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="basis-1/2 space-y-8 py-4 sticky top-24 h-fit">
          <SimilarPostsSkeleton />
        </aside>
      </div>
    </div>
  );
}