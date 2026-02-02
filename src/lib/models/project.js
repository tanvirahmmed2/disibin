import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
        type: [String],
        default: []
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
    image2: {
        type: String,
        trim: true,
        required: true,
    },
    imageId2: { 
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    siteLink: {
        type: String,
        trim: true,
        required: true,
    },
    repository: {
        type: String,
        trim: true,
    },
    tags: {
        type: [String],
        default: []
    },
    skills: {
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

const Project = mongoose.models.projects || mongoose.model('projects', projectSchema)

export default Project