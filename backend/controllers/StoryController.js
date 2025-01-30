import mongoose from "mongoose";
import TravelStory from "../models/travelStory.model.js";

export const addTravelStory =  async (req, res) => {
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
};

export const getAllStories = async (req, res) => {
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
};

export const editStory = async(req,res)=>{
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
};

export const deleteStory = async(req,res)=>{
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
};

export const updateIsFavourite = async(req,res)=>{
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
};

export const searchStory = async(req,res)=>{
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

        // Transform search results to include base64 image if present
        const storiesWithImages = searchResults.map((story) => {
            const transformedStory = story.toObject(); // Convert Mongoose document to plain object
            if (story.imageUrl && story.imageUrl.data) {
                const base64Image = story.imageUrl.data.toString("base64");
                transformedStory.imageUrl = `data:${story.imageUrl.contentType};base64,${base64Image}`;
            }
            return transformedStory;
        });

        return res.status(200).json({ stories: storiesWithImages });
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
};

export const filteredStories = async(req,res)=>{
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

        // Transform search results to include base64 image if present
        const storiesWithImages = filteredStories.map((story) => {
            const transformedStory = story.toObject(); // Convert Mongoose document to plain object
            if (story.imageUrl && story.imageUrl.data) {
                const base64Image = story.imageUrl.data.toString("base64");
                transformedStory.imageUrl = `data:${story.imageUrl.contentType};base64,${base64Image}`;
            }
            return transformedStory;
        });

        return res.status(200).json({ stories: storiesWithImages });
    }
    catch(error){
        return res.status(400).json({error: true, message: error.message});
    }
};