import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import https from 'https';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { specs } from './src/config/swagger.js';
import { errorHandler } from './src/middleware/error.middleware.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import doctorRoutes from './src/routes/doctor.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
import reportRoutes from './src/routes/report.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import chatbotRoutes from './src/routes/chatbot.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import webrtcRoutes from './src/routes/webrtc.routes.js';
import { webhookController } from './src/controllers/payment.controller.js';
import { setupSocket } from './src/services/socket.service.js';

dotenv.config();

const app = express();
let server;

if (process.env.USE_HTTPS === 'true') {
  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  };
  server = https.createServer(options, app);
  console.log('Using HTTPS for server');
} else {
  server = http.createServer(app);
}

// Initialize Socket.io
setupSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthvision';

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get('/', (req, res) => {
  res.send('HealthVision API is running');
});

app.get('/api', (req, res) => {
  res.json({ message: 'HealthVision API is running and secure', status: 'success' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  webhookController
);
app.use('/api/payment', paymentRoutes);
app.use('/api/webrtc', webrtcRoutes);
// 404 Handler - must be after all routes
import { notFoundHandler } from './src/middleware/error.middleware.js';
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

