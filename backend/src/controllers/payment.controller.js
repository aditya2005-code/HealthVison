import razorpay from "../config/razorpay";
import { Payment } from "../models/payment.model";
import { verifyPaymentSignature } from "../utils/verifySignature";
import { User } from "../models/user.model";
const createPayment=async(req,res)=>{
    try {
        const {amount,userId}=req.body;
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(!amount || amount<0){
            return res.status(400).json({message:"Invalid amount"});
        }
        const options={
            amount:amount*100,
            currency:"INR",
            receipt:`payment_${Date.now()}`,
            notes:{
                userId:user._id,
                userEmail:user.email
            }
        }
        const order=await razorpay.orders.create(options);
        await Payment.create({
            userId:user._id,
            amount:amount,
            status:"pending",
            paymentId:order.id
        });
        return res.status(200).json({order});
    } catch (error) {
        
    }
}
const verifyPayment=async(req,res)=>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
        const isValid=verifyPaymentSignature(razorpay_order_id,razorpay_payment_id,razorpay_signature);
        if(!isValid){
            return res.status(400).json({message:"Invalid payment"});
        }
        await Payment.findOneAndUpdate(
            {paymentId:razorpay_order_id},
            {status:"completed",paymentId:razorpay_payment_id},
            {new:true}
        );
        return res.status(200).json({message:"Payment verified successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}
module.exports={createPayment,verifyPayment};