import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period");
    const limit = searchParams.get("limit");
    const isEditorsPick = searchParams.get("isEditorsPick");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {
      published: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categories = {
        some: {
          name: {
            equals: category,
            mode: 'insensitive', // Case-insensitive match
          },
        },
      };
    }

    if (isEditorsPick === "true") {
      where.isEditorsPick = true;
    }

    if (period === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.createdAt = {
        gte: today,
      };
    }

    const posts = await db.post.findMany({
      where,
      include: {
        categories: true, // Include categories for each post
        tags: true,
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
      take: limit ? parseInt(limit) : undefined,
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
