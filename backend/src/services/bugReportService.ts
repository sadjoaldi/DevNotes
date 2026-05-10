import type { Category, Severity, Status } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

type CreateBugReportInput = {
  title: string;
  description: string;
  cause: string;
  solution: string;
  snippet?: string;
  category?: Category;
  status?: Status;
  severity?: Severity;
  isFavorite?: boolean;
  tags?: string[];
  technologies?: string[];
};

type UpdateBugReportInput = Partial<CreateBugReportInput>;

type GetBugReportsFilter = {
  status?: Status;
  severity?: Severity;
  category?: Category;
  isFavorite?: boolean;
};

export class BugReportService {
  // Create
  async createBugReport(input: CreateBugReportInput) {
    const { tags = [], technologies = [], ...data } = input;

    return prisma.bugReport.create({
      data: {
        ...data,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        technologies: {
          connectOrCreate: technologies.map((tech) => ({
            where: { name: tech },
            create: { name: tech },
          })),
        },
      },
      include: { tags: true, technologies: true },
    });
  }

  // Read all with filters
  async getBugReports(filters: GetBugReportsFilter = {}) {
    const { status, severity, category, isFavorite } = filters;

    return prisma.bugReport.findMany({
      where: {
        ...(status && { status }),
        ...(severity && { severity }),
        ...(category && { category }),
        ...(isFavorite !== undefined && { isFavorite }),
      },
      orderBy: { createdAt: "desc" },
      include: { tags: true, technologies: true },
    });
  }

  // Read single
  async getBugReportById(id: string) {
    const bugReport = await prisma.bugReport.findUnique({
      where: { id },
      include: { tags: true, technologies: true },
    });

    if (!bugReport) {
      throw new Error("BugReport not found");
    }

    return bugReport;
  }

  // Update
  async updateBugReport(id: string, input: UpdateBugReportInput) {
    const { tags, technologies, ...data } = input;

    return prisma.bugReport.update({
      where: { id },
      data: {
        ...data,
        ...(tags !== undefined && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
        ...(technologies !== undefined && {
          technologies: {
            set: [],
            connectOrCreate: technologies.map((tech) => ({
              where: { name: tech },
              create: { name: tech },
            })),
          },
        }),
      },
      include: { tags: true, technologies: true },
    });
  }

  // Toggle favorite
  async toggleFavorite(id: string) {
    const bugReport = await this.getBugReportById(id);

    return prisma.bugReport.update({
      where: { id },
      data: { isFavorite: !bugReport.isFavorite },
      include: { tags: true, technologies: true },
    });
  }

  // Delete
  async deleteBugReport(id: string) {
    return prisma.bugReport.delete({
      where: { id },
    });
  }
}

export const bugReportService = new BugReportService();
