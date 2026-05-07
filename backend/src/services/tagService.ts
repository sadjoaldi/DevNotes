import { prisma } from "../lib/prisma";

type Tag = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export class TagService {
  //get all tags
  async getTags() {
    return prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: { notes: true },
    });
  }

  async getTagByNoteId(noteId: string) {
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { tags: true },
    });

    if (!note) {
      throw new Error("Note not found");
    }

    return note.tags;
  }
}

export const tagService = new TagService();
