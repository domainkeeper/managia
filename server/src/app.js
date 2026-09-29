import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));

// Rate limit on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: "Too many login attempts. Please try again later." },
});

// Body parsing
app.use(express.json());

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// API routes
app.use("/api/auth", authLimiter, routes);
app.use("/api", routes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
