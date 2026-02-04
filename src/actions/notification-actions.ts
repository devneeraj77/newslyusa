"use server";

import webpush from "web-push";
import prisma from "@/lib/prisma";

const vapidKeys = {
  publicKey: "BJNEUXdlndoDNWUS6crwQPgO4OhQ80jyPC8F9p5tp-rE4VAwrZhCjY_Abvte1SphZo5NfgLMsVzyKgBIHZVBbsI",
  privateKey: "IaReo__3hPJPntp99quXBYnTsPr1Y9cMVxg1VZwwPnM",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function subscribeUser(sub: PushSubscription, userId?: string) {
  try {
    const stringifiedSub = JSON.stringify(sub);
    const parsedSub = JSON.parse(stringifiedSub);
    
    // Check if subscription already exists
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint: parsedSub.endpoint },
    });

    if (!existing) {
      await prisma.pushSubscription.create({
        data: {
          endpoint: parsedSub.endpoint,
          p256dh: parsedSub.keys.p256dh,
          auth: parsedSub.keys.auth,
          userId: userId || null,
        },
      });
      return { success: true };
    } else {
      // Update userId if it wasn't set or changed
      if (userId && existing.userId !== userId) {
        await prisma.pushSubscription.update({
          where: { endpoint: parsedSub.endpoint },
          data: { userId },
        });
      }
    }
    return { success: true, message: "Already subscribed" };
  } catch (error) {
    console.error("Error saving subscription:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

export async function sendNotification(message: string, url: string = "/", title: string = "New Article Published!", image?: string) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany();

    const notificationPayload = JSON.stringify({
      title: title,
      body: message,
      url: url,
      image: image,
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload
        )
      )
    );

    // Cleanup invalid subscriptions
    const invalidEndpoints: string[] = [];
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            // Check error code, 410 (Gone) or 404 (Not Found) means subscription is dead
            const error = result.reason;
            if (error.statusCode === 410 || error.statusCode === 404) {
                invalidEndpoints.push(subscriptions[index].endpoint);
            }
        }
    });

    if (invalidEndpoints.length > 0) {
        await prisma.pushSubscription.deleteMany({
            where: {
                endpoint: {
                    in: invalidEndpoints
                }
            }
        });
    }

    return { success: true, count: results.filter(r => r.status === 'fulfilled').length };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, error: "Failed to send notifications" };
  }
}
