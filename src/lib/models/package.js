import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    features: [String],
    category: {
        type: String,
        required: true
    },
    isPopular: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

export default Package;