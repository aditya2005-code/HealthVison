import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import doctorRoutes from './src/routes/doctor.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
dotenv.config();

const app = express();

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

// Test route
app.get('/', (req, res) => {
  res.send('HealthVision API is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
