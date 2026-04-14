
import mongoose, { Schema } from "mongoose";


const logSchema=mongoose.Schema({
    userId:{type: Schema.Types.ObjectId, ref:'User'},
    action:{type:String, trim:true, required:true},
    createdAt:{type:Date, default:Date.now}
})

export const Log=mongoose.models.Log || mongoose.model('Log', logSchema)