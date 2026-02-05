import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000';

/**
 * Extract text from a medical report using ML API
 * @param {string} filePath - Path to the uploaded file
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<Object>} - Extracted text and metadata
 */
export const extractTextFromReport = async (filePath, fileType) => {
    try {
        // Check if ML API URL is configured
        if (!process.env.ML_API_URL) {
            console.warn('ML_API_URL not configured. Skipping text extraction.');
            return {
                success: false,
                message: 'ML API not configured',
                extractedText: null
            };
        }

        const FormData = (await import('form-data')).default;
        const fs = (await import('fs')).default;

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('fileType', fileType);

        const response = await axios.post(`${ML_API_URL}/api/ml/extract-text`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 30000 // 30 second timeout
        });

        return {
            success: true,
            extractedText: response.data.extractedText,
            metadata: response.data.metadata || {}
        };
    } catch (error) {
        console.error('Error extracting text from ML API:', error.message);
        
        // Return graceful degradation response
        return {
            success: false,
            message: error.response?.data?.message || 'ML API unavailable',
            extractedText: null,
            error: error.message
        };
    }
};

/**
 * Analyze medical report text using ML API
 * @param {string} extractedText - Text extracted from the report
 * @param {Object} metadata - Additional metadata about the report
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeReportText = async (extractedText, metadata = {}) => {
    try {
        // Check if ML API URL is configured
        if (!process.env.ML_API_URL) {
            console.warn('ML_API_URL not configured. Skipping analysis.');
            return {
                success: false,
                message: 'ML API not configured',
                analysis: null
            };
        }

        if (!extractedText) {
            return {
                success: false,
                message: 'No text provided for analysis',
                analysis: null
            };
        }

        const response = await axios.post(`${ML_API_URL}/api/ml/analyze`, {
            text: extractedText,
            metadata: metadata
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60000 // 60 second timeout for analysis
        });

        return {
            success: true,
            analysis: response.data.analysis,
            insights: response.data.insights || [],
            recommendations: response.data.recommendations || []
        };
    } catch (error) {
        console.error('Error analyzing report with ML API:', error.message);
        
        // Return graceful degradation response
        return {
            success: false,
            message: error.response?.data?.message || 'ML API unavailable',
            analysis: null,
            error: error.message
        };
    }
};

/**
 * Complete report analysis pipeline
 * @param {string} filePath - Path to the uploaded file
 * @param {string} fileType - MIME type of the file
 * @returns {Promise<Object>} - Complete analysis results
 */
export const analyzeReport = async (filePath, fileType) => {
    try {
        // Step 1: Extract text from the report
        const extractionResult = await extractTextFromReport(filePath, fileType);
        
        if (!extractionResult.success) {
            return {
                success: false,
                message: extractionResult.message,
                extractedText: null,
                analysis: null,
                mlApiAvailable: false
            };
        }

        // Step 2: Analyze the extracted text
        const analysisResult = await analyzeReportText(
            extractionResult.extractedText,
            extractionResult.metadata
        );

        return {
            success: analysisResult.success,
            message: analysisResult.success ? 'Analysis completed successfully' : analysisResult.message,
            extractedText: extractionResult.extractedText,
            analysis: analysisResult.analysis,
            insights: analysisResult.insights || [],
            recommendations: analysisResult.recommendations || [],
            mlApiAvailable: true
        };
    } catch (error) {
        console.error('Error in complete report analysis:', error.message);
        
        return {
            success: false,
            message: 'Error during report analysis',
            extractedText: null,
            analysis: null,
            mlApiAvailable: false,
            error: error.message
        };
    }
};
