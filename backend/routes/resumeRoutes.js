import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { saveResume, getResume, generatePDF, generateDOCX } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/save", authMiddleware, saveResume);
router.get("/get", authMiddleware, getResume);
router.get("/pdf", authMiddleware, generatePDF);
router.get("/docx", authMiddleware, generateDOCX);


export default router;
