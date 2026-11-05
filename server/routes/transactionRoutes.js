import express from 'express';
import { getTransactions, issueBook, returnBook } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getTransactions);
router.post('/issue', issueBook);
router.put('/:id/return', returnBook);

export default router;
