import mongoose from "mongoose";

const blogSchema= mongoose.Schema({
    title:{type:String, trim:true, required:true},
    description:{type:String, trim:true, required:true},
    slug:{type:String, trim:true, required:true},
    image:{type:String, trim:true, required:true},
    imageId:{type:String, trim:true, required:true},
    tags:[String],
    isPublished:{type:Boolean, default:true},
    createdAt:{type:Date, default:Date.now}
}, { timestamps: true })

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
export default Blog;