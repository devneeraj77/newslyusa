"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CategoryFormValues } from "./parcials/form";

export async function createCategory(data: CategoryFormValues) {
  try {
    // Check if slug already exists
    const existing = await db.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
        return { success: false, error: "Slug already exists" };
    }

    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });
    revalidatePath("/admin/news/category");
    return { success: true, data: category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  try {
    // Check if slug exists and is not the current category
    const existing = await db.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing && existing.id !== id) {
        return { success: false, error: "Slug already exists" };
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });
    revalidatePath("/admin/news/category");
    return { success: true, data: category };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: { id },
    });
    revalidatePath("/admin/news/category");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete category" };
  }
}
