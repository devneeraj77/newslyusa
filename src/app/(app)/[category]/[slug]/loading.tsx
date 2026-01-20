export default function Loading() {
  return (
    <div className="container min-h-screen mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="h-10 w-3/4 bg-muted animate-pulse rounded mb-4"></div>
        <div className="flex gap-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
        <div className="h-4 w-5/6 bg-muted animate-pulse rounded"></div>
        <div className="h-64 w-full bg-muted animate-pulse rounded mt-8"></div>
      </div>
    </div>
  );
}
