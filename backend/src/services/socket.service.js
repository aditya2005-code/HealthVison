import { Server } from "socket.io";
import { Consultation } from "../models/consultation.model.js";

export const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    // Map to track user IDs and their socket IDs
    const users = new Map();

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("register", (userId) => {
            users.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        socket.on("join-room", async ({ roomId, appointmentId, userId }) => {
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);

            // Update/Create consultation status
            try {
                let consultation = await Consultation.findOne({ roomId });
                if (!consultation) {
                    consultation = await Consultation.create({
                        appointmentId,
                        roomId,
                        startTime: new Date(),
                        status: "active"
                    });
                }

                // Notify others in the room
                socket.to(roomId).emit("user-joined", { userId });
            } catch (error) {
                console.error("Error in join-room:", error);
            }
        });

        socket.on("offer", ({ roomId, offer }) => {
            socket.to(roomId).emit("offer", { offer });
        });

        socket.on("answer", ({ roomId, answer }) => {
            socket.to(roomId).emit("answer", { answer });
        });

        socket.on("ice-candidate", ({ roomId, candidate }) => {
            socket.to(roomId).emit("ice-candidate", { candidate });
        });

        socket.on("leave-room", ({ roomId, userId }) => {
            socket.leave(roomId);
            console.log(`User ${userId} left room ${roomId}`);
            socket.to(roomId).emit("user-left", { userId });
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            // Find and remove user from users map
            for (const [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
        });
    });

    return io;
};
