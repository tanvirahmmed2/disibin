import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        trim:true
    },
    image: {
        type: String,
        trim: true,
        required: true,
    },
    imageId: {
        type: String,
        trim: true,
        required: true,
    },
    preview: {
        type: String,
        trim: true,
        required: true,
    },
    tags: {
        type: [String],
        default: []
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.models.blogs || mongoose.model('blogs', blogsSchema)

export default Blog