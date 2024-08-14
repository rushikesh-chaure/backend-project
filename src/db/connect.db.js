import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstant = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`Database connected successfully, and DB connection Instant : ${connectionInstant.connection.host}`);

    } catch (error) {
        console.log("Database connection Error !!! ",error);
        process.exit(1)
    }
}

export default connectDB;