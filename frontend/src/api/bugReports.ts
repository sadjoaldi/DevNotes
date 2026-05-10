import axios from "axios";
import type {
  BugReport,
  BugReportsFilter,
  CreateBugReportInput,
  UpdateBugReportInput,
} from "../types";

const api = axios.create({
  baseURL: "/api/v1",
});

export const bugReportsApi = {
  getAll: async (filters?: BugReportsFilter): Promise<BugReport[]> => {
    const { data } = await api.get("/bug-reports", { params: filters });
    return data;
  },

  getById: async (id: string): Promise<BugReport> => {
    const { data } = await api.get(`/bug-reports/${id}`);
    return data;
  },

  create: async (input: CreateBugReportInput): Promise<BugReport> => {
    const { data } = await api.post("/bug-reports", input);
    return data;
  },

  update: async (
    id: string,
    input: UpdateBugReportInput,
  ): Promise<BugReport> => {
    const { data } = await api.patch(`/bug-reports/${id}`, input);
    return data;
  },

  toggleFavorite: async (id: string): Promise<BugReport> => {
    const { data } = await api.patch(`/bug-reports/${id}/favorite`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bug-reports/${id}`);
  },
};
