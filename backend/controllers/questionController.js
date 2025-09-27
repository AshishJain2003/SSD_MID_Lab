import Question from "../models/Question.js";

// Student posts a question
export const createQuestion = async (req, res) => {
  try {
    const { classroom_id, question, author } = req.body;

    if (!classroom_id || !question) {
      return res.status(400).json({ error: "classroom_id and question are required" });
    }
    const newQuestion = new Question({
      classroom_id,
      question: question.trim(),
      author: author?.trim() || "Anonymous"
    });
    await newQuestion.save();
    res.status(201).json({message:"Question created successfully",data:newQuestion});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// teacher/student fetch questions
export const getQuestions = async (req, res) => {
  try {
    const { classroom_id } = req.params; 
    const filters = { classroom_id };  
    if (req.query.status) filters.status = req.query.status;
    if (req.query.author) filters.author = req.query.author;
    if (req.query.from || req.query.to) {
      filters.createdAt = {};
      if (req.query.from) filters.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filters.createdAt.$lte = new Date(req.query.to);
    }
    const questions = await Question.find(filters).sort({ createdAt: -1 });
    res.json({ count: questions.length, data: questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// teacher updates status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["answered", "unanswered","important"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!question) return res.status(404).json({ error: "Question not found" });

    res.json({message: "Status updated", data: question});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};