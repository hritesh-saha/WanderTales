import dotenv from "dotenv"
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const createAccount = async(req,res)=>{
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
    const expiresInSeconds = 72 * 60 * 60; // 72 hours in seconds
    const expiryTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds; // Convert to UNIX timestamp

    const accessToken = jwt.sign(
        { userId: user._id, exp: expiryTimestamp },  // Add expiry inside token payload
        process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(201).json({
        error: false,
        user: {
            fullName: user.fullName,
            email: user.email,
        },
        accessToken,
        tokenExpiry: expiryTimestamp, // Send token expiry time to frontend
        message: "Registration Successful",
    });
};

export const login = async(req,res)=>{
    const { email, password }= req.body;
    if(!email || !password){
        return res.status(400).json({error: true, message: "Please fill all fields"});
    }
    const user= await User.findOne({email});

    if(!user){
        return res.status(400).json({error: true, message: "User Not Found!"});
    };

    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({error: true, message: "Invalid Password!"});
    }

    const expiresInSeconds = 72 * 60 * 60; // 72 hours in seconds
    const expiryTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds; // Convert to UNIX timestamp

    const accessToken = jwt.sign(
        { userId: user._id, exp: expiryTimestamp },  // Include expiry in the JWT payload
        process.env.ACCESS_TOKEN_SECRET
    );
  
    return res.status(200).json({
        error: false,
        message: "Login Successful",
        user: {
            fullName: user.fullName,
            email: user.email,
        },
        accessToken,
        tokenExpiry: expiryTimestamp, // Send expiry time to frontend
    });

};

export const getUser =  async(req,res)=>{
  const { userId }=req.user;

  const isUser=await User.findOne({_id: userId});

  if(!isUser){
    return res.status(401).json({error: true, message: "User Not Found!"});
  }

  return res.json({
    error: false,
    user: isUser,
    message: "User Found"
  });
};