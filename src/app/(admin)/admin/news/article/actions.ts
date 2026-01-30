"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ArticleFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: any;
};

export async function saveArticle(formData: any): Promise<ArticleFormState> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const { id, title, slug, content, published, categoryIds, tagIds, image, description, createdAt } = formData;

    if (!title || !slug || !content) {
      return { success: false, message: "Missing required fields" };
    }

    // Find the admin user associated with the session email
    const author = await prisma.admin.findUnique({
      where: { email: session.user.email },
    });

    if (!author) {
      return { success: false, message: "Admin account not found" };
    }

    let article;
    if (id) {
      // Update existing
      article = await prisma.post.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          description,
          image,
          published,
          createdAt: createdAt ? new Date(createdAt) : undefined,
          categoryIds: categoryIds || [],
          tagIds: tagIds || [],
        },
      });
    } else {
      // Create new
      article = await prisma.post.create({
        data: {
          title,
          slug,
          content,
          description,
          image,
          published: published || false,
          authorId: author.id,
          createdAt: createdAt ? new Date(createdAt) : undefined,
          categoryIds: categoryIds || [],
          tagIds: tagIds || [],
        },
      });
    }

    revalidatePath("/admin/news/allArticle");
    revalidatePath(`/admin/news/article?id=${article.id}`);
    revalidatePath("/"); // Revalidate home page if needed

    return { success: true, message: "Article saved successfully", data: article };
  } catch (error) {
    console.error("Error saving article:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to save article" };
  }
}

export async function checkSlugUnique(slug: string, excludeId?: string) {
  try {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      return { isUnique: false };
    }
    return { isUnique: true };
  } catch (error) {
    console.error("Error checking slug:", error);
    return { isUnique: false }; // Fail safe
  }
}
