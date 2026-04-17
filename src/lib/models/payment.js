import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { 
        type: String, 
        enum: ["bkash", "nagad", "card", "bank", "cash"],
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "completed", "failed", "refunded"], 
        default: "pending" 
    },
    transactionId: { type: String, trim: true, required: true },
    paidAt: { type: Date }
}, { timestamps: true });

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;