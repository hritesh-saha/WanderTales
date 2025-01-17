const dotenv= require("dotenv");
dotenv.config();
const bcrypt= require("bcrypt");
const express= require("express");
const cors = require("cors");
const mongoose=require("mongoose");

const User=require("./models/user.model");

const jwt = require("jsonwebtoken");

const port=process.env.PORT;
const db_uri=process.env.DB_URI;
mongoose.connect(db_uri).then(()=>{
    console.log("connected to db");
})

const app=express();
app.use(express.json());
app.use(cors({origin: "*"}));

app.post("/create-account",async(req,res)=>{
    const { fullName, email, password }= req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({error: true, message: "Please fill all fields"});
    }
    const isUser= await User.findOne({email});
    if(isUser){
        return res.status(400).json({error: true, message: "Email already exists"});
    };
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password, salt);

    const user= new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();
    const accessToken= jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: {
            fullName: user.fullName,
            email: user.email,
        },
        accessToken,
        message:"Registration SuccessFul",
    });
});

app.listen(port,()=>{
    console.log(`server is running!`);
});
module.exports= app;