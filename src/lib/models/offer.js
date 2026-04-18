import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    slug: { type: String, trim: true, required: true, unique: true },
    description: { type: String, trim: true, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    features: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
export default Offer;
