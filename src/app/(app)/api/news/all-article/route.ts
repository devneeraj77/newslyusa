import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const article = await prisma.post.findUnique({
        where: { id },
        include: {
          categories: true,
          tags: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      return NextResponse.json(article);
    }

    let articles = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categories: true,
        tags: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Dummy data seeding if empty
    if (articles.length === 0) {
      const admin = await prisma.admin.findFirst();
      if (admin) {
        console.log("Seeding dummy articles...");
        await prisma.post.createMany({
          data: [
            {
              title: "Welcome to Newsly",
              slug: "welcome-to-newsly",
              content: "<p>This is a sample article to get you started. You can edit or delete it from the admin panel.</p>",
              published: true,
              authorId: admin.id,
              categoryIds: [],
              tagIds: [],
            },
            {
              title: "The Power of Next.js",
              slug: "the-power-of-next-js",
              content: "<p>Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.</p>",
              published: false,
              authorId: admin.id,
              categoryIds: [],
              tagIds: [],
            },
          ],
        });

        // Re-fetch after seeding
        articles = await prisma.post.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            categories: true,
            tags: true,
            author: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
      }
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, content, published, categoryIds, tagIds } = body;
    
    if (!title || !slug || !content) {
         return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const author = await prisma.admin.findUnique({
        where: { email: session.user.email }
    });

    if (!author) {
         return NextResponse.json({ error: "Admin account not found" }, { status: 403 });
    }

    const newArticle = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published: published || false,
        authorId: author.id,
        categoryIds: categoryIds || [],
        tagIds: tagIds || [],
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    const updatedArticle = await prisma.post.update({
      where: { id },
      data: cleanData,
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
