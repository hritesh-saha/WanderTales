import dotenv from "dotenv"
dotenv.config();

import express from "express";
import cors from "cors";
import compression from "compression";

import StoryRoutes from "./routes/StoryRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";

import { connectDB } from "./configs/db.js";
connectDB();

const port=process.env.PORT;
const app=express();

app.use(express.json());
app.use(cors({origin: "*"}));
app.use(compression());

app.use("/auth", UserRoutes);
app.use("/api", StoryRoutes);

app.get("/", async(req,res)=>{
    res.send("Welcome to the WanderTales");
})

app.listen(port,()=>{
    console.log(`server is running!`);
});
export default app;