import mongoose, { Schema } from "mongoose";

const purchaseSchema= mongoose.Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User', required:true},
    items:[
        {
            packageId:{type:Schema.Types.ObjectId, ref:'Package', required:true},
            price:{type:Number, required:true},
            discount:{type:Number, default:0},
            total:{type:Number, required:true}
        }
    ],
    total:{type:Number, required:true},
    subTotal:{type:Number, required:true},
    discount:{type:Number, default:0},
    paymentId:{type:Schema.Types.ObjectId, ref:'Payment', required:true},
    status:{type:String, enum:['pending', 'in_progress', 'completed'], default:'pending'},
    createdAt:{type:Date, default:Date.now}

})

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema)
export default Purchase;