import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/signin");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <p>Welcome, {session.user?.name}!</p>
      <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
  {/* Card Image */}
  <div className="relative aspect-video bg-muted">
    {/* Image Component */}
  </div>
  
  <div className="p-4">
    {/* 30% - Heading (High Contrast) */}
    <h3 className="text-foreground font-bold text-lg leading-tight mb-2">
      Article Title
    </h3>
    
    {/* 60% - Body Text (Subtle) */}
    <p className="text-muted-foreground text-sm line-clamp-2">
      Compact description using the muted variable for secondary importance.
    </p>
    
    {/* 10% - Small Accent Detail */}
    <div className="mt-4 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-accent" /> 
      <span className="text-xs font-bold uppercase tracking-wider text-primary">
        New Post
      </span>
    </div>
  </div>
</section>
      {/* Add dashboard widgets here */}
    </div>
  );
}
