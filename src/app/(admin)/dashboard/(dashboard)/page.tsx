import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, List, Mail, MessageSquare } from "lucide-react";
import prisma from "@/lib/prisma";
import { Overview } from "./overview";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/signin");
  }

  const stats = await getDashboardStats();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        { updatedAt: { gte: startOfMonth, lte: endOfMonth } },
      ],
    },
    select: {
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const daysInMonth = endOfMonth.getDate();
  const graphData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      name: `${day.toString()}`,
      created: 0,
      updated: 0,
    };
  });

  posts.forEach((post) => {
    const createdDate = new Date(post.createdAt);
    const updatedDate = new Date(post.updatedAt);

    if (createdDate >= startOfMonth && createdDate <= endOfMonth) {
      const day = createdDate.getDate();
      graphData[day - 1].created++;
    }

    if (updatedDate >= startOfMonth && updatedDate <= endOfMonth) {
      const day = updatedDate.getDate();
      graphData[day - 1].updated++;
    }
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {session.user?.name}! Here&apos;s an overview of your site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.postsCount}</div>
            <p className="text-xs text-muted-foreground">
              Published and drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscribersCount}</div>
            <p className="text-xs text-muted-foreground">
              Newsletter subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesCount}</div>
            <p className="text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesCount}</div>
             <p className="text-xs text-muted-foreground">
              {stats.unreadMessagesCount} unread
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Post Activity (This Month)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 text-sm  text-muted-foreground">
            <Overview data={graphData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {posts
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((post, index) => (                 
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-muted-foreground/20 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                  
                    <p className="text-sm font-medium italic">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
