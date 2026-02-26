import express from "express";
import { createPayment, verifyPayment, getPaymentHistory } from "../controllers/payment.controller.js";
import { VerifyJWT } from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/create", VerifyJWT, createPayment);
router.post("/verify", VerifyJWT, verifyPayment);
router.get("/history", VerifyJWT, getPaymentHistory);

export default router;