import mongoose from "mongoose";

const subscriptionSchema=mongoose.Schema({
    title:{type:String, trim:true, required:true},
    slug:{type:String, trim:true, required:true},
    code:{type:String, trim:true, required:true},
    description:{type:String, trim:true, required:true},
    price:{type:Num, required:true},
    discount:{type:Num, default:0},
    image:{type:String, trim:true, required:true},
    imageId:{type:String, trim:true, required:true},
    startDate:{type:Date},
    endDate:{type:Date},
    createdAt:{type:Date, default:Date.now}
})

export const Subscription=mongoose.models.Subscription || mongoose.model('Subscription',subscriptionSchema)
