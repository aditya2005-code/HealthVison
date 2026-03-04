import express from "express";
import { VerifyJWT } from "../middleware/user.middleware.js";
import {
    sendOffer,
    getOffer,
    sendAnswer,
    getAnswer,
    sendIceCandidate,
    getIceCandidates,
    clearSignalingData,
    getConsultationHistory,
    getRoomStatus
} from "../controllers/webrtc.controller.js";

const router = express.Router();

// Sending endpoints (requires targetUserId in body)
router.post("/offer", VerifyJWT, sendOffer);
router.post("/answer", VerifyJWT, sendAnswer);
router.post("/candidate", VerifyJWT, sendIceCandidate);

// Receiving endpoints (uses req.user.id)
router.get("/offer", VerifyJWT, getOffer);
router.get("/answer", VerifyJWT, getAnswer);
router.get("/candidate", VerifyJWT, getIceCandidates);

// History and Status
router.get("/history", VerifyJWT, getConsultationHistory);
router.get("/status/:roomId", VerifyJWT, getRoomStatus);

// Utility to clear signaling data for the current user
router.delete("/clear", VerifyJWT, clearSignalingData);

export default router;
