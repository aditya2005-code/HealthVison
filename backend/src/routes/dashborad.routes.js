import express from "express";
import { VerifyJWT } from "../middleware/user.middleware";
import { getstats } from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/stats",VerifyJWT,getstats);

export default router;
