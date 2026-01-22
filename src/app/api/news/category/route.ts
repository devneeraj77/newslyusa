import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // If a slug is provided, filter posts by category slug
      const category = await db.category.findUnique({
        where: { slug: slug },
      });

      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }

      const posts = await db.post.findMany({
        where: {
          categoryIds: {
            has: category.id,
          },
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              name: true,
            },
          },
        },
      });

      return NextResponse.json(posts, { status: 200 });
    } else {
      // If no slug is provided, return all categories
      const categories = await db.category.findMany({
        include: {
          posts: {
            select: {
              id: true,
            },
          },
        },
      });
      return NextResponse.json(categories, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
