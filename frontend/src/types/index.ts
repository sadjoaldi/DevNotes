export type Tag = {
  id: string;
  name: string;
};

export type Technology = {
  id: string;
  name: string;
};

export type Status = "OPEN" | "RESOLVED";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Category =
  | "UI"
  | "BACKEND"
  | "DATABASE"
  | "API"
  | "PERFORMANCE"
  | "SECURITY"
  | "OTHER"
  | "FRONTEND"
  | "AUTHENTICATION"
  | "DEPLOYMENT"
  | "DEVOPS"
  | "TESTING";

export type BugReport = {
  id: string;
  title: string;
  description: string;
  cause: string;
  solution: string;
  snippet?: string;
  category: Category;
  status: Status;
  severity: Severity;
  isFavorite: boolean;
  resolvedAt?: string;
  tags: Tag[];
  technologies: Technology[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBugReportInput = {
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

export type UpdateBugReportInput = Partial<CreateBugReportInput>;

export type BugReportsFilter = {
  status?: Status;
  severity?: Severity;
  category?: Category;
  isFavorite?: boolean;
};
