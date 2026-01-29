import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if subscriber already exists
    const existingSubscriber = await db.subscriber.findUnique({
      where: {
        email,
      },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "You are already subscribed to our newsletter." },
        { status: 409 }
      );
    }

    // Create new subscriber
    await db.subscriber.create({
      data: {
        email,
      },
    });

    return NextResponse.json(
      { message: "Subscribed successfully! Thank you for joining our newsletter." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
