"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TagFormValues } from "./parcials/form";

export async function createTag(data: TagFormValues) {
  try {
    // Check if name already exists
    const existing = await db.tag.findUnique({
      where: { name: data.name },
    });

    if (existing) {
        return { success: false, error: "Tag with this name already exists" };
    }

    const tag = await db.tag.create({
      data: {
        name: data.name,
      },
    });
    revalidatePath("/admin/news/tags");
    return { success: true, data: tag };
  } catch (error) {
    console.error("Failed to create tag:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create tag" };
  }
}

export async function updateTag(id: string, data: TagFormValues) {
  try {
    // Check if name exists and is not the current tag
    const existing = await db.tag.findUnique({
      where: { name: data.name },
    });

    if (existing && existing.id !== id) {
        return { success: false, error: "Tag with this name already exists" };
    }

    const tag = await db.tag.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
    revalidatePath("/admin/news/tags");
    return { success: true, data: tag };
  } catch (error) {
    console.error("Failed to update tag:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update tag" };
  }
}

export async function deleteTag(id: string) {
  try {
    await db.tag.delete({
      where: { id },
    });
    revalidatePath("/admin/news/tags");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete tag" };
  }
}
