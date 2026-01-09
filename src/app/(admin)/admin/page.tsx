import { auth, signOut } from "@/auth";
import { ModeToggle } from "@/components/darkModebtn";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/admin/signin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between w-full">
             <h1 className="text-3xl font-bold">Admin Profile</h1>
             <ModeToggle />
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                  <Image 
                    src={`https://ui-avatars.com/api/?name=${session.user?.name?.charAt(0) || "Unknown"}`}
                    alt={session.user?.name?.charAt(0) || "A"}
                    width={64}
                    height={64}
                    className="rounded-full"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-lg">{session.user?.name}</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  {session.user?.email}
                </p>
                <p className="text-xs text-zinc-400 mt-1">ID: {session.user?.id}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
            <h2 className="text-xl font-semibold mb-4">Internal Links</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
                Dashboard
              </Link>
              <Link href="/" className={buttonVariants({ variant: "outline" })}>
                Website Home
              </Link>
            </div>
          </div>

          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <Button variant="destructive" type="submit">Sign Out</Button>
          </form>
        </div>
      </main>
    </div>
  );
}