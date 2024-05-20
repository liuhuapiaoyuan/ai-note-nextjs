/*
  Warnings:

  - You are about to drop the column `noteId` on the `attach_parse_jobs` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attach_parse_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "jobId" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "markdown" TEXT
);
INSERT INTO "new_attach_parse_jobs" ("createdAt", "id", "jobId", "markdown", "status", "updatedAt", "userId") SELECT "createdAt", "id", "jobId", "markdown", "status", "updatedAt", "userId" FROM "attach_parse_jobs";
DROP TABLE "attach_parse_jobs";
ALTER TABLE "new_attach_parse_jobs" RENAME TO "attach_parse_jobs";
CREATE TABLE "new_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "userId" TEXT NOT NULL,
    "chunkIds" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "embeedingStatus" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "description" TEXT,
    "type" INTEGER NOT NULL DEFAULT 0,
    "attachParseJobId" TEXT,
    CONSTRAINT "notes_attachParseJobId_fkey" FOREIGN KEY ("attachParseJobId") REFERENCES "attach_parse_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_notes" ("chunkIds", "content", "createdAt", "description", "embeedingStatus", "id", "tags", "title", "type", "updatedAt", "userId") SELECT "chunkIds", "content", "createdAt", "description", "embeedingStatus", "id", "tags", "title", "type", "updatedAt", "userId" FROM "notes";
DROP TABLE "notes";
ALTER TABLE "new_notes" RENAME TO "notes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
