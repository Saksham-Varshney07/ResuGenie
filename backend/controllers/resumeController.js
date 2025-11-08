import Resume from "../models/Resume.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Document, Packer, Paragraph, TextRun } from "docx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ==========================
   SAVE RESUME
========================== */
export const saveResume = async (req, res) => {
  try {
    console.log("💾 SaveResume called");
    const userId = req.user.id;
    const data = req.body;

    let resume = await Resume.findOne({ userId });

    if (resume) {
      console.log("🟡 Existing resume found — updating");
      Object.assign(resume, data);
      await resume.save();
      console.log("✅ Resume updated");
      return res.status(200).json({ message: "Resume updated successfully", resume });
    } else {
      console.log("🆕 Creating new resume");
      resume = new Resume({ userId, ...data });
      await resume.save();
      console.log("✅ Resume created");
      return res.status(201).json({ message: "Resume created successfully", resume });
    }
  } catch (error) {
    console.error("❌ Error saving resume:", error);
    res.status(500).json({ message: "Server error while saving resume" });
  }
};

/* ==========================
   GET RESUME
========================== */
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });

    if (!resume) {
      return res.status(200).json({
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          address: "",
          linkedin: "",
          website: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
      });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error("❌ Error fetching resume:", error);
    res.status(500).json({ message: "Server error while fetching resume" });
  }
};

/* ==========================
   GENERATE PDF
========================== */
export const generatePDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const resume = await Resume.findOne({ userId });
    if (!resume) return res.status(404).json({ message: "No resume found" });

    // ✅ Add CORS headers to allow frontend download
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    // ✅ Ensure /temp folder exists
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log("📁 Created temp folder:", tempDir);
    }

    const filePath = path.join(
      tempDir,
      `${resume.personalInfo.fullName || "resume"}.pdf`
    );

    const pdf = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    pdf.pipe(stream);

    // Header
    pdf.fontSize(22).text(resume.personalInfo.fullName || "Untitled Resume", {
      underline: true,
      align: "center",
    });
    pdf.moveDown();
    pdf.fontSize(12).text(`Email: ${resume.personalInfo.email || ""}`);
    pdf.text(`Phone: ${resume.personalInfo.phone || ""}`);
    pdf.text(`Address: ${resume.personalInfo.address || ""}`);
    pdf.moveDown();

    // Summary
    pdf.fontSize(14).text("Summary", { underline: true });
    pdf.fontSize(12).text(resume.summary || "No summary provided.");
    pdf.moveDown();

    // Experience
    if (resume.experience?.length > 0) {
      pdf.fontSize(14).text("Experience", { underline: true });
      resume.experience.forEach((exp, i) => {
        pdf.fontSize(12).text(
          `${i + 1}. ${exp.position || "Role"} at ${exp.company || "Company"}`
        );
        pdf.text(exp.description || "");
        pdf.moveDown();
      });
    }

    // Education
    if (resume.education?.length > 0) {
      pdf.fontSize(14).text("Education", { underline: true });
      resume.education.forEach((edu, i) => {
        pdf.fontSize(12).text(
          `${i + 1}. ${edu.degree || "Degree"} - ${edu.institution || "Institution"}`
        );
        pdf.moveDown();
      });
    }

    // Skills
    if (resume.skills?.length > 0) {
      pdf.fontSize(14).text("Skills", { underline: true });
      resume.skills.forEach((skill) => {
        pdf.fontSize(12).text(`- ${skill.category}: ${skill.items}`);
      });
      pdf.moveDown();
    }

    // Projects
    if (resume.projects?.length > 0) {
      pdf.fontSize(14).text("Projects", { underline: true });
      resume.projects.forEach((project, i) => {
        pdf.fontSize(12).text(`${i + 1}. ${project.name}`);
        pdf.text(project.description || "");
        pdf.text(`Tech: ${project.technologies || ""}`);
        if (project.link) pdf.text(`Link: ${project.link}`);
        pdf.moveDown();
      });
    }

    pdf.end();

    stream.on("finish", () => {
      console.log("✅ PDF generated successfully:", filePath);
      res.download(filePath, (err) => {
        if (err) {
          console.error("⚠️ Error during file download:", err);
          return res.status(500).json({ message: "Error sending PDF" });
        }
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("⚠️ Failed to delete temp PDF:", unlinkErr);
          else console.log("🧹 Deleted temp PDF:", filePath);
        });
      });
    });

    stream.on("error", (err) => {
      console.error("❌ Stream error:", err);
      res.status(500).json({ message: "Error writing PDF file" });
    });
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

/* ==========================
   GENERATE DOCX
========================== */
export const generateDOCX = async (req, res) => {
  try {
    const userId = req.user.id;
    const resume = await Resume.findOne({ userId });
    if (!resume) return res.status(404).json({ message: "No resume found" });

    // ✅ Add CORS headers to allow frontend download
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.personalInfo.fullName || "Untitled Resume",
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph(`Email: ${resume.personalInfo.email || ""}`),
            new Paragraph(`Phone: ${resume.personalInfo.phone || ""}`),
            new Paragraph(`Address: ${resume.personalInfo.address || ""}`),
            new Paragraph({ text: "Summary", heading: "Heading1" }),
            new Paragraph(resume.summary || "No summary added."),
            new Paragraph({ text: "Skills", heading: "Heading1" }),
            ...(resume.skills || []).map(
              (skill) =>
                new Paragraph(`- ${skill.category}: ${skill.items}`)
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = `${resume.personalInfo.fullName || "resume"}.docx`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);
    console.log("✅ DOCX generated and sent:", fileName);
  } catch (error) {
    console.error("❌ Error generating DOCX:", error);
    res.status(500).json({ message: "Error generating DOCX" });
  }
};
