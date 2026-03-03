import express from "express";
import { createPayment, verifyPayment, getPaymentHistory, getWalletBalance, walletPayment } from "../controllers/payment.controller.js";
import { VerifyJWT } from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/create", VerifyJWT, createPayment);
router.post("/verify", VerifyJWT, verifyPayment);
router.post("/wallet-payment", VerifyJWT, walletPayment);
router.get("/history", VerifyJWT, getPaymentHistory);
router.get("/balance", VerifyJWT, getWalletBalance);

export default router;