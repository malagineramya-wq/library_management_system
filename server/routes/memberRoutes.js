import express from 'express';
import { createMember, deleteMember, getMembers, updateMember } from '../controllers/memberController.js';

const router = express.Router();

router.get('/', getMembers);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
