import express from "express";
import { VerifyJWT } from "../middleware/user.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";
const router = express.Router();
router.get("/me",VerifyJWT,getCurrentUser)
export default router