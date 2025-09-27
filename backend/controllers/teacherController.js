import Teacher from "../models/Teacher.js";

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await Teacher.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Teacher already exists" });
    }

    const classroom_id = new mongoose.Types.ObjectId().toString();

    const teacher = new Teacher({ username, password ,classroom_id});
    await teacher.save();

    res.status(201).json({ message: "Teacher created successfully", teacher: { id: teacher._id, username: teacher.username ,classroom_id:teacher.classroom_id} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};