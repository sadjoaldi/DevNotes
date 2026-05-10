import type { Express } from "express";
import express from "express";
import morgan from "morgan";
import bugReportRoutes from "./routes/bugReportRoutes";
import tagRoutes from "./routes/tagRoutes";
import technologyRoutes from "./routes/technologyRoutes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/bug-reports", bugReportRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/technologies", technologyRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
