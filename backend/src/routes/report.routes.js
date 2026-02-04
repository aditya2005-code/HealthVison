import express from 'express';
import {
    uploadReport,
    getUserReports,
    getReportById,
    deleteReport
} from '../controllers/report.controller.js';
import { VerifyJWT } from '../middleware/user.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /reports/upload:
 *   post:
 *     summary: Upload a medical report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Report uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', VerifyJWT, upload.single('file'), uploadReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports for authenticated user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', VerifyJWT, getUserReports);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get a specific report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *       404:
 *         description: Report not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', VerifyJWT, getReportById);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       404:
 *         description: Report not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', VerifyJWT, deleteReport);

export default router;
