
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users from DB, returning mock data:", error);
    const mockUsers = [
      { id: "mock-1", name: "Alice Doe", email: "alice@example.com", image: null, createdAt: new Date().toISOString() },
      { id: "mock-2", name: "Bob Smith", email: "bob@example.com", image: null, createdAt: new Date(Date.now() - 10000000).toISOString() },
    ];
    return NextResponse.json(mockUsers);
  }
}
