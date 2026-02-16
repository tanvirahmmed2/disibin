import mongoose from "mongoose";

const supportSchema=new mongoose.Schema({
    name:{
        type: String, trim: true, required: true,
    },
    email:{
        type:String, trim: true, required: true
    },
    subject:{
        type:String, trim:true, required:true
    },
    message:{
        type:String, trim:true, required: true
    },
    createdAt:{
        type:Date, default:Date.now
    }
})

const Support= mongoose.models.supports || mongoose.model('supports', supportSchema)

export default Support