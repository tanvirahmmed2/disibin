import mongoose from "mongoose";
import dns from "dns";
import { MONGODB_URI } from "./secret";

dns.setServers(['8.8.8.8', '8.8.4.4']);

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (!MONGODB_URI) {
        console.error("No MongoDB URI found in environment variables!");
        return;
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("Database connected successfully");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("Failed to connect to database:", e.message);
        throw e;
    }

    return cached.conn;
};

export default connectDB;