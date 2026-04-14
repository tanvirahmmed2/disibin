
import mongoose, { Schema } from "mongoose";


const ticketSchema=mongoose.Schema({
    senderId:{type: Schema.Types.ObjectId, ref:'User'},
    subject:{type:String, trim:true},
    message:{type:String, trim:true},
    attachment:{type:String, trim:true},
    assignedId:{type: Schema.Types.ObjectId, ref:'User'},
    status:{type:String, enum:['open', 'in_progress', 'closed'], default:'open'},
    createdAt:{type:Date, default:Date.now}
})

export const Ticket= mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema)