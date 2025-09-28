import TeachingAssistant from '../models/TeachingAssistant.js';
import Question from '../models/Question.js';
import Classroom from '../models/Classroom.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import passport from 'passport';

// Register a new Teaching Assistant (Admin function)
export const registerTA = async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;

    // Check if TA already exists
    const existingTA = await TeachingAssistant.findOne({
      $or: [{ username }, { email }]
    });

    if (existingTA) {
      return res.status(400).json({ 
        error: existingTA.username === username ? 'Username already exists' : 'Email already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new TA
    const teachingAssistant = new TeachingAssistant({
      username,
      password: hashedPassword,
      email,
      fullName
    });

    await teachingAssistant.save();

    res.status(201).json({
      message: 'Teaching Assistant registered successfully',
      ta: {
        id: teachingAssistant._id,
        username: teachingAssistant.username,
        email: teachingAssistant.email,
        fullName: teachingAssistant.fullName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login Teaching Assistant
export const loginTA = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find TA by username or email
    const teachingAssistant = await TeachingAssistant.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    if (!teachingAssistant) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, teachingAssistant.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    teachingAssistant.lastLogin = new Date();
    await teachingAssistant.save();

    // Create session manually
    req.session.taUser = {
      _id: teachingAssistant._id,
      id: teachingAssistant._id,
      username: teachingAssistant.username,
      role: 'ta'
    };

    // Save the session
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session save failed' });
      }

      res.json({
        message: 'Login successful',
        ta: {
          id: teachingAssistant._id,
          username: teachingAssistant.username,
          fullName: teachingAssistant.fullName,
          email: teachingAssistant.email,
          lastLogin: teachingAssistant.lastLogin
        }
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all questions across all classrooms (for TA review)
export const getAllQuestions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      status = 'all', 
      classroomId = 'all',
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status !== 'all') {
      filter.status = status;
    }
    
    if (classroomId !== 'all') {
      filter.classroom_id = classroomId;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get questions with pagination
    const questions = await Question.find(filter)
      .populate('classroom_id', 'name code')
      .populate('taAnswer.answeredBy', 'username fullName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await Question.countDocuments(filter);

    // Get classroom list for filter
    const classrooms = await Classroom.find({}, 'name code _id').sort({ name: 1 });

    res.json({
      questions: questions.map(q => ({
        id: q._id,
        question: q.question,
        author: q.author,
        color: q.color,
        category: q.category,
        status: q.status,
        timestamp: q.timestamp,
        classroom: q.classroom_id ? {
          id: q.classroom_id._id,
          name: q.classroom_id.name,
          code: q.classroom_id.code
        } : null
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalQuestions: total,
        limit: parseInt(limit)
      },
      filters: {
        classrooms: classrooms.map(c => ({
          id: c._id,
          name: c.name,
          code: c.code
        })),
        statuses: ['all', 'unanswered', 'answered', 'important']
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get questions statistics
export const getQuestionsStats = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const unansweredQuestions = await Question.countDocuments({ status: 'unanswered' });
    const answeredQuestions = await Question.countDocuments({ status: 'answered' });
    const importantQuestions = await Question.countDocuments({ status: 'important' });
    
    const totalClassrooms = await Classroom.countDocuments();
    
    // Questions by category
    const questionsByCategory = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Questions by classroom
    const questionsByClassroom = await Question.aggregate([
      {
        $lookup: {
          from: 'classrooms',
          localField: 'classroom_id',
          foreignField: '_id',
          as: 'classroom'
        }
      },
      {
        $unwind: '$classroom'
      },
      {
        $group: {
          _id: '$classroom_id',
          classroomName: { $first: '$classroom.name' },
          classroomCode: { $first: '$classroom.code' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: {
        totalQuestions,
        unansweredQuestions,
        answeredQuestions,
        importantQuestions,
        totalClassrooms
      },
      questionsByCategory,
      questionsByClassroom
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get TA profile
export const getTAProfile = async (req, res) => {
  try {
    const ta = await TeachingAssistant.findById(req.user._id).select('-password');
    if (!ta) {
      return res.status(404).json({ error: 'Teaching Assistant not found' });
    }

    res.json({
      ta: {
        id: ta._id,
        username: ta.username,
        fullName: ta.fullName,
        email: ta.email,
        isActive: ta.isActive,
        lastLogin: ta.lastLogin,
        createdAt: ta.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout TA
export const logoutTA = async (req, res) => {
  try {
    if (req.session && req.session.taUser) {
      req.session.taUser = null;
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
      });
    } else {
      res.json({ message: 'Logout successful' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

// Answer a question
export const answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answer = req.body.answer;
    const taId = req.user._id;

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ error: 'Answer is required' });
    }

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Prepare attachment data if files were uploaded
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size
      }));
    }

    // Update the question with TA answer
    question.taAnswer = {
      answer: answer.trim(),
      answeredBy: taId,
      answeredAt: new Date(),
      attachments: attachments
    };
    question.status = 'answered';

    await question.save();

    // Populate the answeredBy field for response
    await question.populate('taAnswer.answeredBy', 'username fullName');

    res.json({
      message: 'Question answered successfully',
      question: {
        id: question._id,
        question: question.question,
        status: question.status,
        taAnswer: question.taAnswer
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing TA answer
export const updateAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answer = req.body.answer;
    const taId = req.user._id;

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ error: 'Answer is required' });
    }

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if question has a TA answer
    if (!question.taAnswer) {
      return res.status(400).json({ error: 'Question has no TA answer to update' });
    }

    // Check if the current TA is the one who answered
    if (question.taAnswer.answeredBy.toString() !== taId.toString()) {
      return res.status(403).json({ error: 'You can only update your own answers' });
    }

    // Prepare new attachment data if files were uploaded
    let newAttachments = [];
    if (req.files && req.files.length > 0) {
      newAttachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size
      }));
    }

    // Update the TA answer
    question.taAnswer.answer = answer.trim();
    question.taAnswer.answeredAt = new Date();
    
    // If new attachments are provided, replace the existing ones
    if (newAttachments.length > 0) {
      question.taAnswer.attachments = newAttachments;
    }

    await question.save();

    // Populate the answeredBy field for response
    await question.populate('taAnswer.answeredBy', 'username fullName');

    res.json({
      message: 'Answer updated successfully',
      question: {
        id: question._id,
        question: question.question,
        status: question.status,
        taAnswer: question.taAnswer
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
