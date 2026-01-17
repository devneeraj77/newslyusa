import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const excludeId = searchParams.get("excludeId");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const where: any = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingPost = await prisma.post.findFirst({
      where,
      select: { id: true },
    });

    return NextResponse.json({ isUnique: !existingPost });
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { error: "Failed to check slug" },
      { status: 500 }
    );
  }
}
