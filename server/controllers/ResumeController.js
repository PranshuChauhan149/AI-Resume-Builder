import Resume from "../models/Resume.js";
import fs from "fs";
import imageKit from "../config/ImageKit.js"; // ✔ missing import added

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    console.log(title);

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
    return res.status(200).json({ message: "Resume deleted successfully" }); // ✔ changed 201 → 200
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
      return res.status(404).json({ message: "Resume not found" }); // ✔ added return
    }

    const resumeObj = resume.toObject(); // ✔ convert to plain object
    delete resumeObj.__v;
    delete resumeObj.createdAt;
    delete resumeObj.updatedAt;

    return res.status(200).json({ resume: resumeObj }); // ✔ changed 201 → 200
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" }); // ✔ added return
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;

    // ------- FIX: resumeId + resumeData always come as strings -------
    const resumeId = req.body.resumeId;
    const removeBackground = req.body.removeBackground;
    const resumeData = JSON.parse(req.body.resumeData); // FIXED

    const image = req.file;
    let resumeDataCopy = { ...resumeData };

    // ------- FIX: handle image upload properly -------
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resume",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      if (!resumeDataCopy.personal_info) {
        resumeDataCopy.personal_info = {};
      }
      resumeDataCopy.personal_info.image = response.url;
    }

    // ------- FIX: update the resume correctly -------
    const updated = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "saved successfully",
      resume: updated, // return updated resume (your frontend expects this)
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
