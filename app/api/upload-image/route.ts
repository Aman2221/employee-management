import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUD_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        // ✅ Parse request body properly
        const body = await req.json();
        const { imgFiles } = body;

        console.log("Received Images:", imgFiles);

        // ✅ Validate images array
        if (!imgFiles || !Array.isArray(imgFiles) || imgFiles.length === 0) {
            return NextResponse.json({ error: "Invalid images format" }, { status: 400 });
        }

        // ✅ Upload images to Cloudinary
        const uploadPromises = imgFiles.map((image) =>
            cloudinary.uploader.upload(image, { folder: "bug-reports" })
        );

        const uploadedImages = await Promise.all(uploadPromises);

        // ✅ Return uploaded image URLs
        return NextResponse.json({ urls: uploadedImages.map((img) => img.secure_url) }, { status: 200 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
