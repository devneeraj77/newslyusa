import client from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = 'nodejs'; // Force Node.js runtime

export async function GET() {
  try {
    // The connect() method is called on the MongoClient instance.
    // In this setup, the client is initialized in db.ts but the connection is managed.
    // A more direct way to confirm a connection is to perform a simple operation.
    // The ping command is lightweight and ideal for this.
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return NextResponse.json({ message: "Successfully connected to MongoDB!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    // The error object might contain sensitive information, so we don't return it directly.
    return NextResponse.json({ message: "Failed to connect to MongoDB.", error: (error as Error).message }, { status: 500 });
  }
}
