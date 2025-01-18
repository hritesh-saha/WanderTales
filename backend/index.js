const dotenv= require("dotenv");
dotenv.config();
const bcrypt= require("bcrypt");
const express= require("express");
const cors = require("cors");
const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");
const path=require("path");
const fs=require("fs");

const { AuthenticateToken }= require("./utilities/utilities");

const User=require("./models/user.model");
const TravelStory=require("./models/travelStory.model");
const upload = require("./multer");


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
            userId,
            imageUrl,
            visitedDate: parsedvisitedDate,
        });
        await travelStory.save();

        return res.status(201).json({
            story: travelStory, message:"Added Successfully"
        });
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
});

//Get all Travel Stories
app.get("/get-all-stories", AuthenticateToken, async(req,res)=>{
    const { userId }= req.user;

    try{
        const travelStories = await TravelStory.find({userId: userId}).sort({ isFavourite:-1});
        return res.json({error: false, stories: travelStories, message: "Travel Stories Found"});
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
});

//Route to handle Image Upload
app.post("/image-upload", upload.single("image"), async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error: true, message: "Please upload an image!"});
        }

        const imageUrl=`http://localhost:8000/uploads/${req.file.filename}`;
        return res.json({error: false, imageUrl: imageUrl, message: "Image uploaded successfully!"});
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
});

//Delete an Image from Uploads folder
app.delete("/delete-image", async(req,res)=>{
    const { imageUrl }= req.query;
    if(!imageUrl){
        return res.status(400).json({error: true, message: "Please provide the imagURL!"});
    };

    try{
        //Extract filename from imageURL
        const filename= path.basename(imageUrl);

        //Define file path
        const filePath = path.join(__dirname, "uploads", filename);

        //Check if file exists
        if(fs.existsSync(filePath)){
            //Delete file
            fs.unlinkSync(filePath);
            return res.status(200).json({ message:"Image deleted Successfully"});
        } else {
            return res.status(400).json({error: true, message: "Image not found!"});
        }
    }catch(error){
        return res.status(500).json({error: true, message: error.message});
    }
});

// Serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(port,()=>{
    console.log(`server is running!`);
});
module.exports= app;