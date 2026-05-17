import { z } from "zod";

export const createBugReportSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255),
  description: z.string().min(1, "La description est requise"),
  cause: z.string().min(1, "La cause est requise"),
  solution: z.string().min(1, "La solution est requise"),
  snippet: z.string().optional(),
  duration: z.string().optional(),
  category: z
    .enum([
      "UI",
      "BACKEND",
      "DATABASE",
      "API",
      "PERFORMANCE",
      "SECURITY",
      "OTHER",
      "FRONTEND",
      "AUTHENTICATION",
      "DEPLOYMENT",
      "DEVOPS",
      "TESTING",
    ])
    .optional(),
  status: z.enum(["OPEN", "RESOLVED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  isFavorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
});

export const updateBugReportSchema = createBugReportSchema.partial();
export type CreateBugReportInput = z.infer<typeof createBugReportSchema>;
export type UpdateBugReportInput = z.infer<typeof updateBugReportSchema>;
