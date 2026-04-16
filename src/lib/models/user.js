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
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    
    // Profile Fields
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    address_line1: { type: String, trim: true },
    address_line2: { type: String, trim: true },
    state: { type: String, trim: true },
    postal_code: { type: String, trim: true },
    
    resetToken: { type: String, default: null },
    tokenExpiresAt: { type: Date }

}, { timestamps: true })


export default User= mongoose.models.User || mongoose.model("User", userSchema)