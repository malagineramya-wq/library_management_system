import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env before any db connections
dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB, { isDemoMode } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Library Management System API is running.' });
  });
}

const startServer = async () => {
  try {
    await connectDB();

    if (!isDemoMode()) {
      await seedDatabase();
    }
  } catch (error) {
    console.warn('Startup notice:', error.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`  Library Management System Server Running     `);
    console.log(`  Port: ${PORT} | Demo Mode: ${isDemoMode()}   `);
    console.log(`===============================================`);
  });
};

startServer();
