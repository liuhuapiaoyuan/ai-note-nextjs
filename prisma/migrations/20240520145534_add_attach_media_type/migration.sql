/*
  Warnings:

  - Added the required column `mediaType` to the `attach_parse_jobs` table without a default value. This is not possible if the table is not empty.

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
    "result" TEXT,
    "format" TEXT,
    "mediaType" TEXT NOT NULL
);
INSERT INTO "new_attach_parse_jobs" ("createdAt", "format", "id", "jobId", "result", "status", "updatedAt", "userId") SELECT "createdAt", "format", "id", "jobId", "result", "status", "updatedAt", "userId" FROM "attach_parse_jobs";
DROP TABLE "attach_parse_jobs";
ALTER TABLE "new_attach_parse_jobs" RENAME TO "attach_parse_jobs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
