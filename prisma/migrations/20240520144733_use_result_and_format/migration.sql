/*
  Warnings:

  - You are about to drop the column `markdown` on the `attach_parse_jobs` table. All the data in the column will be lost.

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
    "format" TEXT
);
INSERT INTO "new_attach_parse_jobs" ("createdAt", "id", "jobId", "status", "updatedAt", "userId") SELECT "createdAt", "id", "jobId", "status", "updatedAt", "userId" FROM "attach_parse_jobs";
DROP TABLE "attach_parse_jobs";
ALTER TABLE "new_attach_parse_jobs" RENAME TO "attach_parse_jobs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
