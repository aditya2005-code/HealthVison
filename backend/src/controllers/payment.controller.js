import razorpay from "../config/razorpay.js";
import { Payment } from "../models/payment.model.js";
import { verifyPaymentSignature } from "../utils/verifySignature.js";
import { User } from "../models/user.model.js";
import { Appointment } from "../models/appointment.models.js";
import crypto from "crypto";

export const createPayment = async (req, res) => {
    try {
        const { amount, appointmentId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (!amount || amount < 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `payment_${Date.now()}`,
            notes: {
                userId: user._id.toString(),
                userEmail: user.email,
                appointmentId: appointment._id.toString()
            }
        };

        const order = await razorpay.orders.create(options);

        await Payment.create({
            userId: user._id,
            appointmentId: appointment._id,
            amount: amount,
            status: "pending",
            paymentId: order.id
        });

        return res.status(200).json({ order });
    } catch (error) {
        console.error("Error creating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const payment = await Payment.findOneAndUpdate(
            { paymentId: razorpay_order_id },
            {
                status: "completed",
                transactionId: razorpay_payment_id
            },
            { new: true }
        );

        if (payment) {
            await Appointment.findByIdAndUpdate(payment.appointmentId, { paymentStatus: "Paid" });
        }

        return res.status(200).json({ message: "Payment verified successfully", payment });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await Payment.find({ userId })
            .populate('appointmentId')
            .sort({ createdAt: -1 });

        return res.status(200).json({ payments });
    } catch (error) {
        console.error("Error fetching payment history:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const webhookController = async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(req.body) // req.body must be the raw body buffer from express.raw()
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).send("Invalid webhook signature");
        }

        const event = JSON.parse(req.body.toString());

        if (event.event === "payment.captured") {
            const orderId = event.payload.payment.entity.order_id;

            const payment = await Payment.findOneAndUpdate(
                { paymentId: orderId },
                { status: "completed", transactionId: event.payload.payment.entity.id }
            );

            if (payment) {
                await Appointment.findByIdAndUpdate(payment.appointmentId, { paymentStatus: "Paid" });
            }
        }

        return res.status(200).send("OK");
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).send("Webhook processing failed");
    }
};