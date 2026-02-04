import Report from '../models/report.model.js';
import fs from 'fs';
import path from 'path';

/**
 * Upload a new report
 * POST /api/reports/upload
 */
export const uploadReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const report = new Report({
            userId: req.user.id,
            fileName: req.file.originalname,
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            status: 'pending'
        });

        await report.save();

        res.status(201).json({
            message: 'Report uploaded successfully',
            report: {
                id: report._id,
                fileName: report.fileName,
                fileType: report.fileType,
                fileSize: report.fileSize,
                status: report.status,
                createdAt: report.createdAt
            }
        });
    } catch (error) {
        // If there's an error, delete the uploaded file
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error uploading report', error: error.message });
    }
};

/**
 * Get all reports for the authenticated user
 * GET /api/reports
 */
export const getUserReports = async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            message: 'Reports retrieved successfully',
            count: reports.length,
            reports
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
};

/**
 * Get a specific report by ID
 * GET /api/reports/:id
 */
export const getReportById = async (req, res) => {
    try {
        const report = await Report.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({
            message: 'Report retrieved successfully',
            report
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report', error: error.message });
    }
};

/**
 * Delete a report
 * DELETE /api/reports/:id
 */
export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Delete the file from filesystem
        if (fs.existsSync(report.fileUrl)) {
            fs.unlinkSync(report.fileUrl);
        }

        // Delete from database
        await Report.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting report', error: error.message });
    }
};
