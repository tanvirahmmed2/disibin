import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true }, 
    image: { type: String, publicId: String },
    imageId: { type: String, publicId: String },
    bio:{type: String, required:true, trim:true},
}, { timestamps: true });

export const Team = mongoose.models.teams || mongoose.model("teams", teamSchema);