import mongoose from "mongoose"


const contactSchema= new mongoose.Schema({
    name:{ type:String, required:true, trim: true},
    email:{ type:String, required:true, trim: true},
    subject:{ type:String, required:true, trim: true},
    message:{ type:String, required:true, trim: true},
    status:{type:String, enum:['unread', 'replied'], default:'unread'},
    createdAt:{type: Date, default: Date.now}
})

const Contact= mongoose.models.contacts || mongoose.model('contacts', contactSchema)

export default Contact