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

    const accessToken=jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "72h",
    });
  
    return res.status(200).json({error:false, message:"Login SuccessFul",
        user:{
            fullName: user.fullName,
            email: user.email,
        },
        accessToken,
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