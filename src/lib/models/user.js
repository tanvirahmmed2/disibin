import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: [true, 'User with this email already exists']
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        required: true,
        enum: {
            values: ['user', 'support', 'admin'],
            message: '{VALUE} is not supporetd'
        },
        default: 'user'
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
})

const User = mongoose.models.users || mongoose.model('users', userSchema)

export default User