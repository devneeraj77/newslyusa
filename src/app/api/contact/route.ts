import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/prisma";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, subject, message } = result.data;

    const existingMessage = await db.contactMessage.findFirst({
      where: {
        email,
        createdAt: {
          gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingMessage) {
      return NextResponse.json(
        {
          error:
            "You have already sent a message. We will get back to you soon.",
        },
        { status: 429 },
      );
    }

    await db.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
