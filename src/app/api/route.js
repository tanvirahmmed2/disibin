import ConnectDB from "@/lib/database/mongo";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await ConnectDB()
        return NextResponse.json({
            success:true, message:'Server is running'
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
    }
    
}