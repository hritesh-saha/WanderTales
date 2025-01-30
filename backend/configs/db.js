import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db_uri=process.env.DB_URI;

export const connectDB = async() => {
    try{
        await mongoose.connect(db_uri);
        console.log("Connected to MongoDB");
    }
    catch(error){
        console.log("Error Connecting to Database!",error);
    }
}