import { env } from "./lib/env";

import cors from "cors";
import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import bugReportRoutes from "./routes/bugReportRoutes";
import tagRoutes from "./routes/tagRoutes";
import technologyRoutes from "./routes/technologyRoutes";

const app: Express = express();
const PORT = env.PORT || 3000;

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { rror: "Too many request, please try again later. " },
  standardHeaders: true,
  legacyHeaders: false,
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { rror: "Too many write requests, please try again later. " },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/bug-reports", bugReportRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/technologies", technologyRoutes);

// Middlewaras
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", limiter);
app.use("/api/v1/bug-reports", writeLimiter);
app.use("/api/v1/bug-reports", bugReportRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/technologies", technologyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
