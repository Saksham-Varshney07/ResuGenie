import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();
const app = express();

// ✅ Proper CORS setup (no crash, handles OPTIONS automatically)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies/tokens
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Default route for sanity check
app.get("/", (req, res) => {
  res.send("🌐 ResumeBuilder backend is running fine!");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
