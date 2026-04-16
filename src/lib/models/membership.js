import mongoose from "mongoose";


const memSchema=mongoose.Schema({
    title:{type:String, trim:true, required:true},
    slug:{type:String, trim:true, required:true},
    code:{type:String, trim:true, required:true},
    description:{type:String, trim:true, required:true},
    price:{type:Num, required:true},
    discount:{type:Num, default:0},
    image:{type:String, trim:true, required:true},
    imageId:{type:String, trim:true, required:true},
    duration:{type:String, trim:true, required:true},
    createdAt:{type:Date, default:Date.now}
})

export const Membership= mongoose.models.Membership || mongoose.model('Membership', memSchema)