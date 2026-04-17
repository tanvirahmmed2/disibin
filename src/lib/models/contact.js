
import mongoose from "mongoose";


const contactSchema = mongoose.Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, required: true },
    message: { type: String, trim: true, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
}, { timestamps: true })


export const Contact=mongoose.models.Contact || mongoose.model('Contact', contactSchema)