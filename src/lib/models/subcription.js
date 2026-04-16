import mongoose, { Types } from "mongoose";

const subscriptionSchema=mongoose.Schema({
    userId:{type:Types.ObjectId, ref:'User', required:true},
    membershipId:{type:Types.ObjectId, ref:'Membership', required:true},
    status:{type:String, enum:['pending', 'confirmed', 'paused', 'expired']},
    payStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    payMethod: {
      type: String,
      enum: ["bkash", "nagad", "card", "bank", "cash"],
      required: true,
    },
    total:{type:Number, required:true},
    subTotal:{type:Number, required:true},
    discount:{type:Number, default:0},
    transactionId:{type:String, trim:true, required:true},
    createdAt:{type:Date, default:Date.now},
    paidAt:{Type:Date, required:true}
})

export const Subscription=mongoose.models.Subscription || mongoose.model('Subscription',subscriptionSchema)
