import ConnectDB from "@/lib/database/mongo";
import WebSite from "@/lib/models/website";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        await ConnectDB()
        const{id, hotline}=await req.json()
        if(!id || !hotline){
            return NextResponse.json({
                success:false,
                message:'Please fill all information'
            }, {status:400})
        }

        const website= await WebSite.findById(id)
        if(!website){
            return NextResponse.json({
                success:false,
                message:'Website data not found'
            },{status:400})
        }
        website.hotline=hotline
        const change= await website.save()
        if(!change){
            return NextResponse.json({
                success:false,
                message:'Could not change hotline'
            }, {status:400})
        }

        return NextResponse.json({
            success:true,
            message:'Successfully saved change'
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:'Failed to submit data',
            error: error.message
        },{status:500})
        
    }
    
}