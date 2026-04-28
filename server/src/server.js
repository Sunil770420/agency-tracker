import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import metaAdsRoutes from './routes/metaAdsRoutes.js';
import googleAdsRoutes from './routes/googleAdsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/meta-ads', metaAdsRoutes);
app.use('/api/google-ads', googleAdsRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});