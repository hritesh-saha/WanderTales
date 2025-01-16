const dotenv= require("dotenv");
dotenv.config();
const bcrypt= require("bcrypt");
const express= require("express");
const cors = require("cors");
const mongoose=require("mongoose");

const jwt = require("jsonwebtoken");

const port=process.env.PORT;
const db_uri=process.env.DB_URI;
mongoose.connect(db_uri).then(()=>{
    console.log("connected to db");
})

const app=express();
app.use(express.json());
app.use(cors({origin: "*"}));

app.get("/hello",async(req,res)=>{
    return res.status(200).json({message: "hello"});
});

app.listen(port,()=>{
    console.log(`server is running!`);
});
module.exports= app;