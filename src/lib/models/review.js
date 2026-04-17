import mongoose, { Types } from "mongoose";

const reviewSchema=mongoose.Schema({
    userId:{type:Types.ObjectId, ref:'User', required:true},
    rate:{type:Number, required:true, min:1, max:5},
    comment:{type:String, required:true, trim:true},
    isApproved:{type:Boolean, default:false},
    createdAt:{type:Date, default:Date.now}

})

export const Review= mongoose.models.Review || mongoose.model('Review', reviewSchema)
