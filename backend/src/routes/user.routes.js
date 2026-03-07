import express from "express";
import { VerifyJWT } from "../middleware/user.middleware.js";
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", VerifyJWT, getCurrentUser);
router.put("/profile", VerifyJWT, updateProfile);

export default router;