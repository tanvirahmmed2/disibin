import connectDB from "@/lib/database/db";
import { isSupport } from "@/lib/middleware";
import { Contact } from "@/lib/models/contact";
import { NextResponse } from "next/server";

export async function GET(req,{params}) {
    try {
        await connectDB()
        const auth= await isSupport()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:auth.message
            },{status:400})
        }

        const {id}= await params
        if(!id){
            return NextResponse.json({
                success:false, message:'Id not found'
            },{status:400})
        }

        const support= await Contact.findById(id)
        if(!support){
            return NextResponse.json({
                success:false, message:'No data found'
            },{status:400})
        }
        return NextResponse.json({
            success:true, message:'Successfully fetched data', payload:support
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}


export async function POST(req) {
    try {
        await connectDB()
        const auth= await isSupport()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:auth.message
            },{status:400})
        }
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}