import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import metaAdsRoutes from './routes/metaAdsRoutes.js';
import googleAdsRoutes from './routes/googleAdsRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import importExportRoutes from './routes/importExportRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'Agency Tracker API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/meta-ads', metaAdsRoutes);
app.use('/api/google-ads', googleAdsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/import-export', importExportRoutes);

export default app;