const dotenv= require("dotenv");
dotenv.config();
const bcrypt= require("bcrypt");
const express= require("express");
const cors = require("cors");
const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");
const path=require("path");
const fs=require("fs");
const multer = require("multer");

const { AuthenticateToken }= require("./utilities/utilities");

const User=require("./models/user.model");
const TravelStory=require("./models/travelStory.model");
//const upload = require("./multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


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
        user:{
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


app.post("/add-travel-story", AuthenticateToken, upload.single("image"), async (req, res) => {
    const { title, story, visitedLocation, visitedDate } = req.body;
    const { userId } = req.user;

    try {
        // Searching for placeholder story
        const placeholderStory = await TravelStory.findOne({
            title: "placeholder",
            userId: new mongoose.Types.ObjectId("000000000000000000000000"),
        });

        if (placeholderStory) {
            console.log("Placeholder found");
        }

        // Handle image URL (uploaded or placeholder)
        let imageUrl = null;
        if (req.file) {
            // File is uploaded, store in imageUrl
            imageUrl = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        } else if (placeholderStory && placeholderStory.imageUrl) {
            // No file uploaded, use the placeholder's imageUrl
            imageUrl = {
                data: placeholderStory.imageUrl.data,
                contentType: placeholderStory.imageUrl.contentType,
            };
        }

        // Ensure we have image data
        if (!imageUrl || !imageUrl.data) {
            return res.status(400).json({
                error: true,
                message: "No image found. Please provide an image for this story.",
            });
        }

        if (!title || !story || !visitedLocation || !visitedDate) {
            return res.status(400).json({ error: true, message: "Please fill all the fields!" });
        }

        const parsedvisitedDate = new Date(parseInt(visitedDate)); // Convert visitedDate to Date Object

        // Save the travel story with the image
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            visitedDate: parsedvisitedDate,
            imageUrl,
            //isFavourite: isFavourite !== undefined ? JSON.parse(isFavourite) : false,
        });

        await travelStory.save();

        return res.status(201).json({
            story: travelStory,
            message: "Travel Story Added Successfully",
        });
    } catch (error) {
        console.error("Error saving travel story:", error);
        return res.status(400).json({ error: true, message: error.message });
    }
});


//Get all Travel Stories
app.get("/get-all-stories", AuthenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        // Fetch all travel stories for the given userId, sorted by isFavourite
        const travelStories = await TravelStory.find({ userId }).sort({ isFavourite: -1 });

        // Transform stories to include base64 image if present
        const storiesWithImages = travelStories.map((story) => {
            const transformedStory = story.toObject(); // Convert Mongoose document to plain object
            if (story.imageUrl && story.imageUrl.data) {
                const base64Image = story.imageUrl.data.toString("base64");
                transformedStory.imageUrl = `data:${story.imageUrl.contentType};base64,${base64Image}`;
            }
            return transformedStory;
        });

        return res.status(200).json({
            error: false,
            stories: storiesWithImages,
            message: "Travel Stories Found",
        });
    } catch (error) {
        console.error("Error fetching travel stories:", error);
        return res.status(500).json({ error: true, message: "Unable to fetch travel stories." });
    }
});



//Edit Travel Story
app.put("/edit-story/:id", AuthenticateToken, upload.single("image"),async(req,res)=>{
     const { id } =req.params;
     const { title, story, visitedLocation, visitedDate, exists}= req.body;
     const { userId } = req.user;

     const placeholderStory = await TravelStory.findOne({ title: "placeholder",userId:new mongoose.Types.ObjectId("000000000000000000000000") });

     let imageUrl;

     if(exists){
        const user = await TravelStory.findOne({ _id:id, userId:userId })
        imageUrl = user.imageUrl
     }else {
        imageUrl = req.file ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        } : (placeholderStory ? placeholderStory.imageUrl : null);
     }

    if (!imageUrl) {
        return res.status(400).json({
            error: true,
            message: "No placeholder image found in the database. Please provide an image for this story.",
        });
    }

     if(!title || !story || !visitedLocation || !visitedDate){
        return res.status(400).json({error: true, message: "Please fill all the fields!"});
    };

    //Convert visitedDate from milliseconds to Date Object
    const parsedvisitedDate = new Date(parseInt(visitedDate));

    try{
        //Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory= await TravelStory.findOne({ _id:id, userId: userId});

        if(!travelStory){
            return res.status(404).json({error: true, message: "Travel Story Not Found"});
        };


        travelStory.title=title;
        travelStory.story=story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl;
        travelStory.visitedDate = parsedvisitedDate;

        await travelStory.save();

        return res.status(200).json({ story:travelStory, message:"Updated Successfully!"})
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
});

//Delete a travel story
app.delete("/delete-story/:id", AuthenticateToken, async(req,res)=>{
    const { id } = req.params;
    const { userId } = req.user;
    try{
        //Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory= await TravelStory.findOne({ _id:id, userId: userId});

        if(!travelStory){
            return res.status(404).json({error: true, message: "Travel Story Not Found"});
        };

        await travelStory.deleteOne({ _id: id, userId: userId });

        return res.status(200).json({ message: "Travel story deleted successfully!"});
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
});

//Update isFavourite
app.put("/update-is-favourite/:id", AuthenticateToken, async(req,res)=>{
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try{
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if(!travelStory){
            return res.status(404).json({error: true, message: "Travel Story Not Found"});
        };
        //const isFavourite=JSON.parse(isFavourite);

        travelStory.isFavourite=isFavourite;
        await travelStory.save();

        return res.status(200).json({ story:travelStory, message:"Updated Successfully"});
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
})

//Search Travel Stories
app.get("/search", AuthenticateToken, async(req,res)=>{
    const { query } = req.query;
    const { userId } = req.user;

    if(!query){
        return res.status(400).json({error: true, message: "Please enter a search query"});
    };

    try{
        const searchResults = await TravelStory.find({
            userId:userId,
            $or:[
                {title:{$regex:query,$options:'i'} },
                {story:{$regex:query,$options:'i'}},
                { visitedLocation: {$regex:query,$options:'i'}},
            ],
        }).sort({ isFavourite: -1});

        return res.status(200).json({ stories: searchResults});
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
});

// Filter stories by date range
app.get("/travel-stories/filter", AuthenticateToken, async(req,res)=>{
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try{
        //Convert startDate and endDate from milliseconds to Date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        // Find travel stories that belong to the authenticated user and fall within the date range
        const filteredStories = await TravelStory.find({
            userId:userId,
            visitedDate: { $gte: start, $lte:end},
        }).sort({ isFavourite: -1});

        return res.status(200).json({stories: filteredStories});
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
})



app.listen(port,()=>{
    console.log(`server is running!`);
});
module.exports= app;