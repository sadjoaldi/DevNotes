import { prisma } from "../lib/prisma";

const notes = await prisma.note.findMany();
