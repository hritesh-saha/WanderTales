import mongoose from "mongoose";

const travelStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    story:{
        type:String,
        required:true,
    },
    visitedLocation: {
        type: [String],
        default: [],
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    isPublic: {
        type: Boolean,
        default: true, // By default, all stories are public
    },    
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdOn:{
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String, // Cloudinary URL will be stored here
        required: true, // Ensure every story has an image
    },
    visitedDate:{
        type:Date,
        required: true,
    }
});

const TravelStory = mongoose.model("TravelStory", travelStorySchema);

export default TravelStory;