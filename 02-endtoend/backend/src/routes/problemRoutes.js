import express from 'express';
import {
  createProblem,
  getProblem,
  getProblems,
  updateProblem,
} from '../controllers/problemController.js';
import { authMiddleware } from '../middleware/index.js';

const router = express.Router();

router.post('/', authMiddleware, createProblem);
router.get('/', getProblems);
router.get('/:id', getProblem);
router.put('/:id', authMiddleware, updateProblem);

export default router;
