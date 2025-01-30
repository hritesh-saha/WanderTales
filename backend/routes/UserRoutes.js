import express from "express";
import { AuthenticateToken } from "../middleware/utilities.js";
import { createAccount, login, getUser } from "../controllers/UserController.js";

const router = express.Router();

router.post("/create-account", createAccount);
router.post("/login", login);
router.get("/get-user", AuthenticateToken, getUser);

export default router;