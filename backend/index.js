import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
