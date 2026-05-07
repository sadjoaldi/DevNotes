import { Router } from "express";
import { tagController } from "../controllers/tagController";

const router: Router = Router();

router.get("/", tagController.getAll);
router.get("/notes/:id/tags", tagController.getByNoteId);

export default router;
