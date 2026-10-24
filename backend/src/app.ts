import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import classRoutes from "./modules/class/class.routes.js";
import testRoutes from "./modules/Exam/test.route.js";
import questionRoutes from "./modules/question/question.route.js";
import submissionRoutes from "./modules/submission/submission.route.js";
import resultRoutes from "./modules/result/result.route.js";
import cors from "cors";


const app = express();


// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

// Auth routes
app.use("/api/auth", authRoutes);

//class routes
app.use("/api/classes", classRoutes);

//test routes
app.use("/api/tests", testRoutes);

// Question routes
app.use("/api/questions", questionRoutes);

// Submission routes
app.use("/api/submissions", submissionRoutes);

// Result routes
app.use("/api/results", resultRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("✅ Server running!");
});

export default app;
