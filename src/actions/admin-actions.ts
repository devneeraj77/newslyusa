"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteContactMessage(id: string) {
  try {
    await db.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/news/contact");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}

export async function markContactMessageAsRead(id: string) {
  try {
    await db.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/news/contact");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    return { success: false, error: "Failed to update message" };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    await db.subscriber.delete({
      where: { id },
    });
    revalidatePath("/admin/news/subsciptions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return { success: false, error: "Failed to delete subscriber" };
  }
}

export async function markSubscriberAsRead(id: string) {
  try {
    // @ts-ignore: Field might not be in generated client yet due to EPERM
    await db.subscriber.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/news/subsciptions");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark subscriber as read:", error);
    // @ts-ignore
    return { success: false, error: error?.message || "Failed to update subscriber" };
  }
}
