import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    website: String,
  },
  summary: String,
  experience: [
    {
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      gpa: String,
    },
  ],
  skills: [
    {
      category: String,
      items: String,
    },
  ],
  projects: [
    {
      name: String,
      description: String,
      technologies: String,
      link: String,
    },
  ],
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
