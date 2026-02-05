import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userImage: {type:String, required:true},
    userImageId: {type:String, required:true},
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false } 
}, { timestamps: true });

export const Review = mongoose.models.reviews || mongoose.model("reviews", reviewSchema);