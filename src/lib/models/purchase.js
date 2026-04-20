import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, required: true },

            type: { 
                type: String, 
                enum: ["package", "offer"],
                required: true 
            },

            title: { type: String, required: true },
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 }
        }
    ],

    totalAmount: { type: Number, required: true },

    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'cancelled'], 
        default: 'pending' 
    },

    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    paymentMethod: { type: String },
    paymentStatus: { type: String, default: 'pending' }

}, { timestamps: true });

export const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
export default Purchase;