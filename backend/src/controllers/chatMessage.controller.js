import ChatMessage from "../models/chatMessage.model.js";

// Create a new chat message
export const createChatMessage = async (req, res) => {
    try {
        const { userId, message, response, urgency } = req.body;
        
        // Validate required fields
        if (!userId || !message || !response || !urgency) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId, message, response, urgency"
            });
        }

        const chatMessage = await ChatMessage.create({
            userId,
            message,
            response,
            urgency
        });

        res.status(201).json({
            success: true,
            data: chatMessage
        });
    } catch (error) {
        console.error("Error creating chat message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create chat message",
            error: error.message
        });
    }
};

// Get chat history for a specific user
export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, page = 1, urgency } = req.query;

        // Build query filter
        const filter = { userId };
        if (urgency) {
            filter.urgency = urgency;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch chat messages with pagination
        const chatMessages = await ChatMessage.find(filter)
            .sort({ createdAt: -1 }) // Most recent first
            .limit(parseInt(limit))
            .skip(skip)
            .populate('userId', 'name email'); // Populate user details if needed

        // Get total count for pagination
        const total = await ChatMessage.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: chatMessages,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch chat history",
            error: error.message
        });
    }
};

// Get a specific chat message by ID
export const getChatMessageById = async (req, res) => {
    try {
        const { messageId } = req.params;

        const chatMessage = await ChatMessage.findById(messageId)
            .populate('userId', 'name email');

        if (!chatMessage) {
            return res.status(404).json({
                success: false,
                message: "Chat message not found"
            });
        }

        res.status(200).json({
            success: true,
            data: chatMessage
        });
    } catch (error) {
        console.error("Error fetching chat message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch chat message",
            error: error.message
        });
    }
};

// Delete a chat message
export const deleteChatMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const chatMessage = await ChatMessage.findByIdAndDelete(messageId);

        if (!chatMessage) {
            return res.status(404).json({
                success: false,
                message: "Chat message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat message deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting chat message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete chat message",
            error: error.message
        });
    }
};

// Delete all chat history for a User
export const deleteChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await ChatMessage.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} chat messages`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Error deleting chat history:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete chat history",
            error: error.message
        });
    }
};