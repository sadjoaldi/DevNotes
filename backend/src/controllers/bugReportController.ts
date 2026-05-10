import type { Request, Response } from "express";
import type { Category, Severity, Status } from "../../generated/prisma";
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
      const {
        title,
        description,
        cause,
        solution,
        snippet,
        category,
        status,
        severity,
        isFavorite,
        tags,
        technologies,
      } = req.body;

      if (!title || !description || !cause || !solution) {
        res.status(400).json({
          error: "Title, description, cause and solution are required",
        });
        return;
      }

      const bugReport = await bugReportService.createBugReport({
        title,
        description,
        cause,
        solution,
        snippet,
        category,
        status,
        severity,
        isFavorite,
        tags,
        technologies,
      });

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
      const {
        title,
        description,
        cause,
        solution,
        snippet,
        category,
        status,
        severity,
        isFavorite,
        tags,
        technologies,
      } = req.body;

      if (
        !title &&
        !description &&
        !cause &&
        !solution &&
        !snippet &&
        !category &&
        !status &&
        !severity &&
        isFavorite === undefined &&
        !tags &&
        !technologies
      ) {
        res.status(400).json({ error: "Nothing to update" });
        return;
      }

      const bugReport = await bugReportService.updateBugReport(req.params.id, {
        title,
        description,
        cause,
        solution,
        snippet,
        category,
        status,
        severity,
        isFavorite,
        tags,
        technologies,
      });

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
