import mongoose from "mongoose";

const packSchema = new mongoose.Schema(
    {
        title: { type: String, trim: true, required: true },
        slug: { type: String, trim: true, required: true },
        description: { type: String, trim: true, required: true },
        features: [String],
        image: { type: String, trim: true, required: true },
        imageId: { type: String, trim: true, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        category: { type: String, trim: true, required: true }
    },
    { timestamps: true }
);

export const Package =
    mongoose.models.Package || mongoose.model("Package", packSchema);

export default Package;