export default function Loading() {
  return (
    <div className="container min-h-screen mx-auto px-4 py-12">
      <div className="h-10 w-48 bg-muted animate-pulse rounded mb-8"></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className=" rounded-lg p-4 space-y-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-20 w-full bg-muted animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
