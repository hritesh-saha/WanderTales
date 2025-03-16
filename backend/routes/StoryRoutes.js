import express from "express";
import { AuthenticateToken } from "../middleware/utilities.js";
import { addTravelStory, getAllStories, editStory, deleteStory, updateIsFavourite, searchStory, filteredStories, exploreStories } from "../controllers/StoryController.js";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/add-travel-story", AuthenticateToken, upload.single("image"), addTravelStory);
router.get("/get-all-stories", AuthenticateToken, getAllStories);
router.put("/edit-story/:id", AuthenticateToken, upload.single("image"), editStory);
router.delete("/delete-story/:id", AuthenticateToken, deleteStory);
router.put("/update-is-favourite/:id", AuthenticateToken, updateIsFavourite);
router.get("/search", AuthenticateToken, searchStory);
router.get("/travel-stories/filter", AuthenticateToken, filteredStories);
router.get("/explore-stories",exploreStories);

export default router;