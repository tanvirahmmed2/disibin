import ConnectDB from "@/lib/database/mongo";
import Contact from "@/lib/models/contact";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await ConnectDB()

        const contacts = await Contact.find({}).sort({ createdAt: -1 })
        if (!contacts) {
            return NextResponse.json({ success: false, message: "contact data not found" }, { status: 400 })
        }
        return NextResponse.json({ success: true, message: 'Successfully fetched contact data', payload: contacts }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: ' Failed to fetch contact data', error: error.message }, { status: 500 })

    }

}

export async function DELETE(req) {
    try {

        await ConnectDB()

        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({ success: false, message: 'Id not found' }, { status: 400 })
        }
        const contact = await Contact.findById(id)
        if (!contact) {
            return NextResponse.json({
                success: false, message: 'contact data not found'
            }, { status: 400 })
        }

        await Contact.findByIdAndDelete(id)

        return NextResponse.json({
            success: true, message: 'Successfully deleted contact data'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: ' Failed to delete contact data', error: error.message }, { status: 500 })

    }

}

export async function POST(req) {
    try {
        await ConnectDB()
        const {name, email, subject, message}= await req.json()
        if(!name || !email || !subject || !message){
            return NextResponse.json({
                 success: false, message:"Please fill all information"
            },{status:400})
        }

        const newContact= new Contact({name, email, subject, message})

        await newContact.save()

        return NextResponse.json({
            success: true, message:'Placed contact message. Wait for response'
        },{status:200})
    } catch (error) {
        return NextResponse.json({success:false, message:'Failed to create contact message', error:error.message}, {status:500})
    }
    
}