import mongoose, { Types } from "mongoose";

const paymentSchema=mongoose.Schema({
    purchaseId:{type: Types.ObjectId, ref:'Purchase', required:true},
    total:{type:Number, required:true},
    subTotal:{type:Number, required:true},
    discount:{type:Number, default:0},
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["bkash", "nagad", "card", "bank", "cash"],
      required: true,
    },
    transactionId:{type:String, trim:true, required:true},
    createdAt:{type:Date, default:Date.now},
    paidAt:{Type:Date, required:true}
})

export const Payment= mongoose.models.Payment || mongoose.model('Payment', paymentSchema)