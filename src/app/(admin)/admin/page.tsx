import { auth, signOut } from "@/auth";
import { ModeToggle } from "@/components/darkModebtn";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, LayoutDashboard, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/signin");
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-12 font-sans">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <ModeToggle />
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden  border bg-card text-card-foreground shadow-sm">
          <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>
          <div className="px-6 pb-6">
            <div className="relative -mt-12 mb-4 flex justify-between items-end">
              <div className="relative h-24 w-24 overflow-hidden  border-4 border-card bg-muted shadow-sm">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <User className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="mb-1 hidden sm:block">
                <span className="inline-flex items-center  bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Admin
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                {session.user?.name || "Admin User"}
              </h2>
              <p className="text-muted-foreground">{session.user?.email}</p>
              <p className="text-xs text-muted-foreground font-mono pt-1">
                ID: {session.user?.id}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="group relative flex flex-col gap-1  border bg-card p-6 shadow-sm transition-all hover:shadow hover:border-primary/50"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center -lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Access analytics, content management, and site settings.
            </p>
          </Link>
          <Link
            href="/"
            className="group relative flex flex-col gap-1  border bg-card p-6 shadow-sm transition-all hover:shadow hover:border-primary/50"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center -lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <HomeIcon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Website Home</h3>
            <p className="text-sm text-muted-foreground">
              View the live website as a visitor.
            </p>
          </Link>
        </div>

        {/* Sign Out */}
        <div className=" border bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-semibold">Sign Out</h3>
              <p className="text-sm text-muted-foreground">
                Securely end your current session.
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button
                variant="destructive"
                type="submit"
                className="w-full rounded-none sm:w-auto gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
