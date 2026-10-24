import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db/mongo.js";

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

const PORT = process.env.PORT || 4000;
const MONGO_URI: string = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qa_system";
try {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("Failed to start server:", err);
}

