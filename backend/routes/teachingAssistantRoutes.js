import express from 'express';
const router = express.Router();
import {
  registerTA,
  loginTA,
  getAllQuestions,
  getQuestionsStats,
  getTAProfile,
  logoutTA,
  answerQuestion,
  updateAnswer
} from '../controllers/teachingAssistantController.js';
import { isTAAuthenticated } from '../middleware/taAuth.js';
import upload from '../middleware/upload.js';

// Public routes
router.post('/register', registerTA);
router.post('/login', loginTA);

// Protected routes (require authentication)
router.get('/profile', isTAAuthenticated, getTAProfile);
router.get('/questions', isTAAuthenticated, getAllQuestions);
router.get('/stats', isTAAuthenticated, getQuestionsStats);
router.post('/logout', isTAAuthenticated, logoutTA);
router.post('/answer/:questionId', isTAAuthenticated, upload.array('attachments', 5), answerQuestion);
router.put('/answer/:questionId', isTAAuthenticated, upload.array('attachments', 5), updateAnswer);

export default router;
