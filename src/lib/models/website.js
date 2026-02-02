import mongoose from "mongoose"


const websiteSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: 'WebSite',
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    tagline: {
        type: String,
        trim: true,
        required: true
    },
    fbLink: {
        type: String,
        trim: true,
    },
    igLink: {
        type: String,
        trim: true,
    },
    liLink: {
        type: String,
        trim: true,
    },
    githubLink: {
        type: String,
        trim: true,
    },
    hotline: {
        type: String,
        trim: true,
    },
    categories: [
        { type: String, trim: true }
    ]
    ,
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
    bio: {
        type: String,
        trim: true,
        required: true
    },
})

const WebSite = mongoose.models.websites || mongoose.model('websites', websiteSchema)

export default WebSite