import multer from "multer";

// Configure multer to use memory storage (no disk storage)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

// Initialize multer instance
const upload = multer({ storage, fileFilter });

export default upload;
