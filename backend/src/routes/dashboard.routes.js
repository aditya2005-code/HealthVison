import express from "express";
import { VerifyJWT } from "../middleware/user.middleware.js";
import { getStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", VerifyJWT, getStats);

export default router;
