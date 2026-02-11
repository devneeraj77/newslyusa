import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
    <main className="max-w-7xl mx-auto p-4 mt-8">
      {/* Page Title */}
      <Skeleton className="h-10 w-64 mb-8" />

      <section className="min-h-screen flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Breadcrumb */}
          <div className="pt-1 border-dashed border-muted pb-3 mb-4">
             <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid grid-cols-1 pt-2 md:grid-cols-2 gap-8">
            {/* 1. Main Featured Article Skeleton */}
            <div className="flex flex-col border-dashed border-b md:border-b-0 pb-4">
              <div className="relative aspect-[17/8] w-full mb-4 overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2">
                 <Skeleton className="h-3 w-24" />
                 <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* 2. Secondary Articles Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-8 content-start">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="relative aspect-video w-full mb-3 overflow-hidden">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Last Month Skeleton */}
          <section>
            <div className="py-8 my-10">
              <div className="flex gap-2 mb-6">
                 <Skeleton className="h-7 w-48" />
                 <Skeleton className="h-7 w-7 " />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-3 " />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="w-full xl:min-h-250 lg:w-64 shrink-0">
          <div className="sticky top-2 space-y-6">
            {/* Header */}
            <div className="p-1 border-b border-dashed border-muted">
              <Skeleton className="h-4 w-24 mb-1" />
            </div>

            {/* Stories List */}
            <div className="flex flex-col gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 " />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* More News Section Skeleton */}
      <section className="mt-12 min-h-80">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="w-full py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col h-full overflow-hidden">
                <Skeleton className="aspect-[17/6] w-full" />
                <div className="py-4 flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>

  );
}