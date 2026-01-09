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
      {/* Add dashboard widgets here */}
    </div>
  );
}
