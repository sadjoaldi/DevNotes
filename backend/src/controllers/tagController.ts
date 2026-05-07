import type { Request, Response } from "express";
import { tagService } from "../services/tagService";

export const tagController = {
  // GET /api/v1/tags
  async getAll(req: Request, res: Response) {
    try {
      const tags = await tagService.getTags();
      res.json(tags);
      return;
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tags" });
      return;
    }
  },

  // GET /api/v1/notes/:id/tags
  async getByNoteId(req: Request<{ id: string }>, res: Response) {
    try {
      const tags = await tagService.getTagByNoteId(req.params.id);
      res.json(tags);
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "Note not found") {
        res.status(404).json({ error: "Note not found" });
        return;
      }
      res.status(500).json({ error: "Failed to fetch tags" });
      return;
    }
  },
};
