const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const journalRoutes = require("./routes/journalRoutes");
const blogsRoutes = require("./Routes/blogRoutes")

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-url.com","http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.send("Clinic Backend is Live ✅");
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/blogs",blogsRoutes)


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
