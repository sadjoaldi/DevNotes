import type { Request, Response } from "express";
import { noteService } from "../services/noteService";

export const noteController = {
  // Get all notes
  async getAll(req: Request, res: Response) {
    try {
      const notes = await noteService.getNotes();
      res.json(notes);
      return;
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch notes",
      });
      return;
    }
  },

  //get a single note by id

  async getNoteById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
      const note = await noteService.getNoteById(id);
      res.json(note);
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "Note not found") {
        res.status(404).json({ error: "Note not found" });
      } else {
        res.status(500).json({ error: "Failed to fetch note" });
        return;
      }
    }
  },

  // post notes

  async create(req: Request, res: Response) {
    try {
      const { title, content, tags } = req.body;

      if (!title || !content) {
        res.status(400).json({
          error: "Title and content are required",
        });
        return;
      }
      const note = await noteService.createNote({ title, content, tags });
      res.status(201).json(note);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create note" });
      return;
    }
  },

  //update, patch note
  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: "Nothing to update" });
        return;
      }

      const note = await noteService.updateNote(id, { title, content, tags });
      res.json(note);
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "Note not found") {
        res.status(404).json({ error: "Note not found" });
        return;
      } else {
        res.status(500).json({ error: "Failed to update note" });
        return;
      }
    }
  },

  // delete note

  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      await noteService.deleteNote(id);
      res.status(204).send();
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "Note not found") {
        res.status(404).json({ error: "Note not found" });
      } else {
        res.status(500).json({ error: "Failed to delete note" });
      }
    }
  },
};
