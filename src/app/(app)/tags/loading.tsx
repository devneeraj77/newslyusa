export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-10 w-32 bg-muted animate-pulse rounded mb-8"></div>
      <div className="flex flex-wrap gap-4">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-muted animate-pulse rounded-full"></div>
        ))}
      </div>
    </div>
  );
}
