import connectDB from "@/lib/database/db";
import Membership from "@/lib/models/membership";
import { NextResponse } from "next/server";



export async function GET(req,{params}) {
    try {
        await connectDB()
        const {slug}= await params

        if(!slug){
            return NextResponse.json({
                success:false, message:'Slug not found'
            },{status:400})
        }
        const membership= await Membership.findOne({slug})
        if(!membership){
            return NextResponse.json({
                success:false, message:'Membership data not found'
            },{status:400})
        }
        return NextResponse.json({
            success:true, message:'Successfully fetched data', payload:membership
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}