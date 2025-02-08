import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUD_API_SECRET,
});

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); // ✅ Corrected return type
    }

    try {
        const reader = req.body?.getReader();
        const result = await reader?.read();
        const body: any = result?.value ? Buffer.from(result.value).toString() : '';

        console.log("body:", req.body);
        const { images } = JSON.parse(body); // ✅ Next.js automatically parses JSON, so no need to manually parse

        if (!images || !Array.isArray(images)) {
            return NextResponse.json({ error: "Invalid images format" }, { status: 400 });
        }

        const uploadPromises = images.map((image) =>
            cloudinary.uploader.upload(image, { folder: "bug-reports" })
        );

        const uploadedImages = await Promise.all(uploadPromises);

        return NextResponse.json({ urls: uploadedImages.map((img) => img.secure_url) }, { status: 200 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
