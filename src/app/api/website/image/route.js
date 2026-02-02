import cloudinary from "@/lib/database/cloudinary";
import ConnectDB from "@/lib/database/mongo";
import WebSite from "@/lib/models/website";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        await ConnectDB()
        const data = await req.formData();
        const id = data.get('id');
        const imageFile = data.get('image');
        if (!id || !imageFile) {
            return NextResponse.json({
                success: false,
                message: 'Please fill all information'
            }, { status: 400 })
        }

        const website = await WebSite.findById(id)
        if (!website) {
            return NextResponse.json({
                success: false,
                message: 'Website data not found'
            }, { status: 400 })
        }
        cloudinary.uploader.destroy(website.imageId)
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "tanvirahmmed" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(imageBuffer);
        });

        const change = await WebSite.findByIdAndUpdate(id, { image: cloudImage.secure_url, imageId: cloudImage.public_id })
        if (!change) {
            return NextResponse.json({
                success: false,
                message: 'Could not change image'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully saved change'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to submit data',
            error: error.message
        }, { status: 500 })

    }

}