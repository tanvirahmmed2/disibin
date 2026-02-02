import cloudinary from "@/lib/database/cloudinary";
import ConnectDB from "@/lib/database/mongo";
import WebSite from "@/lib/models/website";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        await ConnectDB()

        const websites = await WebSite.find({})
        if (!websites || websites.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No website data found'
            }, { status: 400 })
        }
        const website = websites[0]
        return NextResponse.json({
            success: true,
            message: 'Successfully fetched data',
            payload: website
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            success: false, message: 'Failed to fetch data', error: error.message
        }, { status: 500 })

    }

}


export async function POST(req) {
    try {
        await ConnectDB()

        const websites = await WebSite.find({})
        if (websites.length > 0) {
            return NextResponse.json({
                success: false,
                message: 'Already website details added, Please update'
            }, { status: 400 })
        }

        const formData = await req.formData();
        
        const title = formData.get("title");
        const bio = formData.get("bio");
        const tagline = formData.get("tagline");
        const address = formData.get("address");
        const fbLink = formData.get("fbLink");
        const igLink = formData.get("igLink");
        const liLink = formData.get("liLink");
        const githubLink = formData.get("githubLink");
        const hotline = formData.get("hotline");
        const categories = formData.get("categories");
        const imageFile = formData.get("image");

        if (!title || !bio || !tagline || !imageFile) {
            return NextResponse.json({
                success: false,
                message: 'Please fill all required information and upload an image'
            }, { status: 400 })
        }

        const cateArry = categories ? categories.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0) : [];

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

        const newWebsite = new WebSite({ 
            title, 
            bio, 
            tagline, 
            address, 
            fbLink, 
            igLink, 
            liLink, 
            githubLink, 
            hotline, 
            categories: cateArry,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id
        })

        await newWebsite.save()
        
        return NextResponse.json({
            success: true,
            message: 'Successfully submitted data'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false, 
            message: 'Failed to submit data', 
            error: error.message
        }, { status: 500 })
    }
}