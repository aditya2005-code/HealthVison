const express=require("express");
const router=express.Router();
const {createPayment,verifyPayment}=require("../controllers/payment.controller.js");
const {VerifyJWT}=require("../middleware/user.middleware.js");
router.post("/create",VerifyJWT,createPayment);
router.post("/verify",VerifyJWT,verifyPayment);
module.exports=router;