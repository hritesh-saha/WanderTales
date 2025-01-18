const dotenv= require("dotenv");
dotenv.config();
const bcrypt= require("bcrypt");
const express= require("express");
const cors = require("cors");
const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");

const { AuthenticateToken }= require("./utilities/utilities");

const User=require("./models/user.model");
const TravelStory=require("./models/travelStory.model");


const port=process.env.PORT;
const db_uri=process.env.DB_URI;
mongoose.connect(db_uri).then(()=>{
    console.log("connected to db");
})

const app=express();
app.use(express.json());
app.use(cors({origin: "*"}));

//Create Account
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

//Login
app.post("/login",async(req,res)=>{
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
        yser:{
            fullName: user.fullName,
            email: user.email,
        },
        accessToken,
    });

});

//Get User
app.get("/get-user", AuthenticateToken, async(req,res)=>{
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
});

//Add Travel Story
app.post("/add-travel-story", AuthenticateToken, async(req,res)=>{
    const { title, story, visitedLocation, imageUrl, visitedDate}= req.body;
    const { userId }= req.user;

    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(400).json({error: true, message: "Please fill all the fields!"});
    };

    //Convert visitedDate from milliseconds to Date Object
    const parsedvisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory= new TravelStory({
            title,
            story,
            visitedLocation,
            imageUrl,
            visitedDate: parsedvisitedDate,
        });
        await travelStory.save();

        return res.status(201).json({
            story: travelStory, message:"Added Successfully"
        });
    }
    catch(error){
        return res.status(400).json({error: true, message: "Invalid Data!"});
    }
})

app.listen(port,()=>{
    console.log(`server is running!`);
});
module.exports= app;