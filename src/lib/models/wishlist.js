import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { 
        type: String, 
        enum: ["package", "membership", "offer"], 
        required: true 
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    slug: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

wishlistSchema.index({ userId: 1, itemId: 1, type: 1 }, { unique: true });

export const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
