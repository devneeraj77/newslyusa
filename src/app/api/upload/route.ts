import { NextRequest, NextResponse } from "next/server";
// import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "This route is disabled. Use CldUploadWidget." }, { status: 501 });
  
  /*
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "newslyusa";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const result = await uploadToCloudinary(file, folder) as any;

    return NextResponse.json({ 
        url: result.secure_url,
        public_id: result.public_id 
    }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
  */
}