import express from 'express';
import {
  createInterview,
  getInterview,
  getUserInterviews,
  updateInterview,
  executeCode,
  submitSolution,
  getInterviewSolutions,
} from '../controllers/interviewController.js';
import { authMiddleware } from '../middleware/index.js';

const router = express.Router();

router.post('/', authMiddleware, createInterview);
router.get('/user/interviews', authMiddleware, getUserInterviews);
router.get('/:id', authMiddleware, getInterview);
router.put('/:id', authMiddleware, updateInterview);
router.post('/:id/execute', authMiddleware, executeCode);
router.post('/:id/solutions', authMiddleware, submitSolution);
router.get('/:id/solutions', authMiddleware, getInterviewSolutions);

export default router;
