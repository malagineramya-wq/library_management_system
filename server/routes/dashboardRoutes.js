import express from 'express';
import { getDashboardStats, seedSampleData } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', getDashboardStats);
router.post('/seed', seedSampleData);

export default router;
