"use server";

import db from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [
      postsCount,
      adminsCount,
      categoriesCount,
      subscribersCount,
      messagesCount,
      unreadMessagesCount,
    ] = await Promise.all([
      db.post.count(),
      db.admin.count(),
      db.category.count(),
      db.subscriber.count(),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { isRead: false } }),
    ]);

    return {
      postsCount,
      adminsCount,
      categoriesCount,
      subscribersCount,
      messagesCount,
      unreadMessagesCount,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      postsCount: 0,
      adminsCount: 0,
      categoriesCount: 0,
      subscribersCount: 0,
      messagesCount: 0,
      unreadMessagesCount: 0,
    };
  }
}
