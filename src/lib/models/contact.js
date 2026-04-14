
import mongoose from "mongoose";


const contactSchema=mongoose.Schema({
    name:{type:String, trim:true, required:true},
    email:{type:String, trim:true, required:true},
    subject:{type:String, trim:true, required:true},
    message:{type:String, trim:true, required:true},
    createdAt:{type:Date, default:Date.now}
})


export const Contact=mongoose.models.Contact || mongoose.model('Contact', contactSchema)