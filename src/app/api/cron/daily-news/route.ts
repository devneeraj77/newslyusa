import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendNotification } from '@/actions/notification-actions';

export async function GET(req: Request) {
  try {
    // 1. Find posts from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const latestPosts = await prisma.post.findMany({
      where: {
        published: true,
        createdAt: {
          gte: yesterday,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1, 
    });

    const count = await prisma.post.count({
      where: {
         published: true,
         createdAt: {
          gte: yesterday,
        },
      }
    });

    if (latestPosts.length === 0) {
      return NextResponse.json({ message: 'No new posts today' });
    }

    // 2. Create notification content
    const topPost = latestPosts[0];
    const notificationTitle = "Daily News Update";
    const message = count > 1 
      ? `${topPost.title} and ${count - 1} other new stories.`
      : `${topPost.title}`;
    
    const url = `/news/${topPost.slug}`;

    // 3. Send notification
    const result = await sendNotification(message, url, notificationTitle, topPost.image ?? undefined);

    return NextResponse.json({ 
      success: true, 
      sentCount: result.count,
      message: `Sent notification for ${count} posts` 
    });

  } catch (error) {
    console.error('Daily cron failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
