import mongoose from "mongoose";
import { MONGO_URL } from "./secret";


const ConnectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log('MongoDB server connected successfully')
    } catch (error) {
        console.log(error)
        console.log('Failed to connect to mongodb')
    }
}

export default ConnectDB