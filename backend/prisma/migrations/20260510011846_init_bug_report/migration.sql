/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NoteTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_NoteTags";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BugReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "snippet" TEXT,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BugReportTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BugReportTags_A_fkey" FOREIGN KEY ("A") REFERENCES "BugReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BugReportTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BugReportTechnologies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BugReportTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "BugReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BugReportTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BugReportTags_AB_unique" ON "_BugReportTags"("A", "B");

-- CreateIndex
CREATE INDEX "_BugReportTags_B_index" ON "_BugReportTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BugReportTechnologies_AB_unique" ON "_BugReportTechnologies"("A", "B");

-- CreateIndex
CREATE INDEX "_BugReportTechnologies_B_index" ON "_BugReportTechnologies"("B");
