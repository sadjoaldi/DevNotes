import type { Request, Response } from "express";
import type { Category, Severity, Status } from "../../generated/prisma";
import { createBugReportSchema, updateBugReportSchema } from "../lib/validators";
import { bugReportService } from "../services/bugReportService";

export const bugReportController = {
  // GET /api/v1/bug-reports
  async getAll(req: Request, res: Response) {
    try {
      const { status, severity, category, isFavorite } = req.query;

      const bugReports = await bugReportService.getBugReports({
        ...(status && { status: status as Status }),
        ...(severity && { severity: severity as Severity }),
        ...(category && { category: category as Category }),
        ...(isFavorite !== undefined && {
          isFavorite: isFavorite === "true",
        }),
      });

      res.json(bugReports);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch bug reports" });
      return;
    }
  },

  // GET /api/v1/bug-reports/:id
  async getOne(req: Request<{ id: string }>, res: Response) {
    try {
      const bugReport = await bugReportService.getBugReportById(req.params.id);
      res.json(bugReport);
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "BugReport not found") {
        res.status(404).json({ error: "BugReport not found" });
        return;
      }
      res.status(500).json({ error: "Failed to fetch bug report" });
      return;
    }
  },

  // POST /api/v1/bug-reports
  async create(req: Request, res: Response) {
    try {
      const parsed = createBugReportSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Données invalides",
          details: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      const bugReport = await bugReportService.createBugReport(parsed.data);
      res.status(201).json(bugReport);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create bug report" });
      return;
    }
  },

  // PATCH /api/v1/bug-reports/:id
  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const parsed = updateBugReportSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Données invalides",
          details: parsed.error.flatten().fieldErrors,
        });
        return;
      }

      if (Object.keys(parsed.data).length === 0) {
        res.status(400).json({ error: "Nothing to update" });
        return;
      }

      const bugReport = await bugReportService.updateBugReport(req.params.id, parsed.data);
      res.json(bugReport);
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "BugReport not found") {
        res.status(404).json({ error: "BugReport not found" });
        return;
      }
      res.status(500).json({ error: "Failed to update bug report" });
      return;
    }
  },

  // PATCH /api/v1/bug-reports/:id/favorite
  async toggleFavorite(req: Request<{ id: string }>, res: Response) {
    try {
      const bugReport = await bugReportService.toggleFavorite(req.params.id);
      res.json(bugReport);
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "BugReport not found") {
        res.status(404).json({ error: "BugReport not found" });
        return;
      }
      res.status(500).json({ error: "Failed to toggle favorite" });
      return;
    }
  },

  // DELETE /api/v1/bug-reports/:id
  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      await bugReportService.deleteBugReport(req.params.id);
      res.status(204).send();
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "BugReport not found") {
        res.status(404).json({ error: "BugReport not found" });
        return;
      }
      res.status(500).json({ error: "Failed to delete bug report" });
      return;
    }
  },
};
