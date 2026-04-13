import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    phone: { type: String, trim: true, required: true },
    role: {
        type: String,
        enum: ["admin", "manager", "project_manager", "editor", "support", "staff", "client"],
        default: "client"
    },
    password:{type:String, trim:true, required:true},
    isActive:{
        type:Boolean, default:true
    },

}, { timestamps: true })


export default User= mongoose.models.User || mongoose.model("User", userSchema)