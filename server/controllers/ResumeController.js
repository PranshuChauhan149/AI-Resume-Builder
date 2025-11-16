import Resume from "../models/Resume.js";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const newResume = await Resume.create({
      userId,
      title,
    });
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(201).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      res.status(404).json({ message: "Resume not found" });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


