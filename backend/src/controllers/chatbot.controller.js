import { ChatMessage } from "../models/chat.model.js";
import Report from "../models/report.model.js";
import mongoose from "mongoose";

/**
 * Send a message to the chatbot with report context awareness
 * POST /api/chatbot/message
 */
export const sendMessage = async (req, res, next) => {
    try {
        const { message, urgency, reportId, context } = req.body;
        const userId = req.user.id;

        // Input validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: "Valid message text is required" 
            });
        }

        if (message.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Message cannot be empty" 
            });
        }

        if (message.length > 5000) {
            return res.status(400).json({ 
                success: false, 
                message: "Message is too long (max 5000 characters)" 
            });
        }

        // Validate urgency if provided
        const validUrgencies = ['Low', 'Medium', 'High'];
        const messageUrgency = urgency && validUrgencies.includes(urgency) ? urgency : 'Low';

        // Validate context if provided
        const validContexts = ['general', 'report_analysis', 'appointment', 'medical_query'];
        const messageContext = context && validContexts.includes(context) ? context : 'general';

        let relatedReports = [];
        let reportContext = '';
        let metadata = {
            reportIds: [],
            keywords: extractKeywords(message),
            sentiment: 'neutral'
        };

        // If reportId is provided, fetch and validate the report
        if (reportId) {
            // Validate MongoDB ObjectId format
            if (!mongoose.Types.ObjectId.isValid(reportId)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid report ID format" 
                });
            }

            try {
                const report = await Report.findOne({
                    _id: reportId,
                    userId: userId
                }).select('fileName status analysisResult extractedText createdAt').lean();

                if (!report) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Report not found or you don't have access to it" 
                    });
                }

                // Check if report has been analyzed
                if (report.status !== 'completed') {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Report analysis is ${report.status}. Please wait for analysis to complete.`,
                        reportStatus: report.status
                    });
                }

                relatedReports.push(reportId);
                metadata.reportIds.push(reportId);

                // Build context from report analysis
                reportContext = buildReportContext(report);

            } catch (error) {
                console.error('Error fetching report:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error accessing report data",
                    error: error.message 
                });
            }
        }

        // Generate AI response with report context
        let responseText = await generateChatbotResponse(
            message, 
            messageUrgency, 
            reportContext,
            messageContext
        );

        // Create chat message with all metadata
        const chatMessage = await ChatMessage.create({
            userId,
            message: message.trim(),
            response: responseText,
            urgency: messageUrgency,
            relatedReports,
            context: messageContext,
            metadata
        });

        // Populate related reports for response
        await chatMessage.populate('relatedReports', 'fileName status createdAt');

        res.status(201).json({
            success: true,
            data: chatMessage
        });

    } catch (error) {
        console.error('Error in sendMessage:', error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid data format'
            });
        }

        next(error);
    }
};

/**
 * Get chat history with pagination and filtering
 * GET /api/chatbot/history
 */
export const getHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Pagination parameters with validation
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        // Optional filters
        const { context, urgency, startDate, endDate } = req.query;

        // Build query
        const query = { userId };

        if (context && ['general', 'report_analysis', 'appointment', 'medical_query'].includes(context)) {
            query.context = context;
        }

        if (urgency && ['Low', 'Medium', 'High'].includes(urgency)) {
            query.urgency = urgency;
        }

        // Date range filter
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                const start = new Date(startDate);
                if (!isNaN(start.getTime())) {
                    query.timestamp.$gte = start;
                }
            }
            if (endDate) {
                const end = new Date(endDate);
                if (!isNaN(end.getTime())) {
                    query.timestamp.$lte = end;
                }
            }
        }

        // Execute query with optimization
        const [history, totalCount] = await Promise.all([
            ChatMessage.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .populate('relatedReports', 'fileName status createdAt')
                .select('-__v')
                .lean(), // Use lean for better performance (read-only)
            ChatMessage.countDocuments(query)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: history,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });

    } catch (error) {
        console.error('Error in getHistory:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid query parameters'
            });
        }

        next(error);
    }
};

/**
 * Get chat messages related to a specific report
 * GET /api/chatbot/report/:reportId
 */
export const getReportConversations = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { reportId } = req.params;

        // Validate reportId
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid report ID format" 
            });
        }

        // Verify report exists and belongs to user
        const report = await Report.findOne({
            _id: reportId,
            userId: userId
        }).select('fileName status').lean();

        if (!report) {
            return res.status(404).json({ 
                success: false, 
                message: "Report not found" 
            });
        }

        // Find all chat messages related to this report
        const conversations = await ChatMessage.find({
            userId,
            relatedReports: reportId
        })
            .sort({ timestamp: -1 })
            .select('-__v')
            .lean();

        res.status(200).json({
            success: true,
            report: {
                id: reportId,
                fileName: report.fileName,
                status: report.status
            },
            count: conversations.length,
            data: conversations
        });

    } catch (error) {
        console.error('Error in getReportConversations:', error);
        next(error);
    }
};

/**
 * Delete a chat message
 * DELETE /api/chatbot/message/:messageId
 */
export const deleteMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;

        // Validate messageId
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid message ID format" 
            });
        }

        const message = await ChatMessage.findOneAndDelete({
            _id: messageId,
            userId: userId
        });

        if (!message) {
            return res.status(404).json({ 
                success: false, 
                message: "Message not found or already deleted" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat message deleted successfully"
        });

    } catch (error) {
        console.error('Error in deleteMessage:', error);
        next(error);
    }
};

// ============= Helper Functions =============

/**
 * Build context string from report analysis
 */
function buildReportContext(report) {
    let context = `Report: ${report.fileName}\n`;
    
    if (report.analysisResult) {
        if (report.analysisResult.analysis) {
            context += `Analysis: ${report.analysisResult.analysis}\n`;
        }
        if (report.analysisResult.insights) {
            context += `Insights: ${report.analysisResult.insights}\n`;
        }
        if (report.analysisResult.recommendations) {
            context += `Recommendations: ${report.analysisResult.recommendations}\n`;
        }
    }
    
    if (report.extractedText) {
        // Limit extracted text to prevent context overflow
        const textPreview = report.extractedText.substring(0, 1000);
        context += `Extracted Text: ${textPreview}${report.extractedText.length > 1000 ? '...' : ''}\n`;
    }
    
    return context;
}

/**
 * Generate chatbot response based on message and context
 */
async function generateChatbotResponse(message, urgency, reportContext, context) {
    let responseText = '';

    // Handle urgent messages
    if (urgency === 'High') {
        responseText = "⚠️ This sounds urgent. If this is a medical emergency, please call emergency services immediately or visit the nearest hospital.\n\n";
    }

    // Context-aware responses
    if (reportContext) {
        responseText += `I've reviewed your report. Based on the information:\n\n`;
        responseText += `Your question: "${message}"\n\n`;
        responseText += `Report Context:\n${reportContext}\n\n`;
        responseText += `Please note: This is an AI assistant. For medical advice, always consult with your healthcare provider.`;
    } else {
        // General response when no report context
        switch (context) {
            case 'appointment':
                responseText += `Regarding appointments: ${message}\n\nI can help you with appointment-related queries. `;
                break;
            case 'medical_query':
                responseText += `Medical Query: ${message}\n\nWhile I can provide general information, please consult a healthcare professional for medical advice. `;
                break;
            default:
                responseText += `I received your message: "${message}"\n\n`;
                responseText += `I'm here to help with your health-related questions. You can ask me about your reports, appointments, or general health information.`;
        }
    }

    return responseText;
}

/**
 * Extract keywords from message for metadata
 */
function extractKeywords(message) {
    // Simple keyword extraction (can be enhanced with NLP)
    const commonWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'my', 'i', 'me', 'what', 'how', 'when', 'where', 'why'];
    
    const words = message.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Return unique keywords (max 10)
    return [...new Set(words)].slice(0, 10);
}

