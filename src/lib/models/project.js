import mongoose from "mongoose";


const projectSchema= mongoose.Schema({
    title:{type:String, trim:true, required:true},
    slug:{type:String, trim:true, required:true},
    description:{type:String, trim:true, required:true},
    features: [String],
    image:{type:String, trim:true, required:true},
    imageId:{type:String, trim:true, required:true},
    category:{type:String, trim:true, required:true},
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    createdAt:{type:Date, default:Date.now}
}, { timestamps: true })

export const Project=mongoose.models.Project || mongoose.model('Project', projectSchema)
