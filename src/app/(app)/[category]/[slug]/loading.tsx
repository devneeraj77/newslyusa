import { SimilarPostsSkeleton } from "@/components/similar-posts";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="basis-3/2">
          <div className="max-w-4xl">
            {/* Breadcrumb Skeleton */}
            <div className="mt-4 mb-4">
              <div className="h-4 w-48 bg-muted animate-pulse " />
            </div>

            {/* Title Skeleton */}
            <div className="h-8 xs:h-9  sm:h-10 md:h-14 w-3/4 bg-muted animate-pulse  my-10" />

            {/* Author/Meta Skeleton */}
            <div className="flex items-end justify-between">
              <div className="flex pt-4 gap-2 items-center">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse " />
                  <div className="h-3 w-32 bg-muted animate-pulse " />
                </div>
              </div>
              <div className="h-8 w-8 bg-muted animate-pulse " />
            </div>

            {/* Content Skeleton */}
            <div className="mt-8">
              {/* Image */}
              <div className="relative aspect-[17/12] md:aspect-[16/6] w-full bg-muted animate-pulse  mb-" />

              {/* Text lines */}
              <div className="space-y-4">
                <div className="h-4 w-full bg-muted animate-pulse " />
                <div className="h-4 w-full bg-muted animate-pulse " />
                <div className="h-4 w-5/6 bg-muted animate-pulse " />
                <div className="h-4 w-full bg-muted animate-pulse " />
                <div className="h-4 w-4/5 bg-muted animate-pulse " />
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
