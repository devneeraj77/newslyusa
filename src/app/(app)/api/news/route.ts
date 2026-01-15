import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await db.post.findMany({
      where: {
        published: true,
      },
      include: {
        categories: true, // Include categories for each post
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
      // You can add limits or pagination here if needed
      // take: 10,
    });

    return NextResponse.json(posts);
  } catch (error ) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({
      message: "Error fetching posts",
      error: (error as Error).message
    }, { status: 500 });
  }
}
