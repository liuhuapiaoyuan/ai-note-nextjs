-- CreateTable
CREATE TABLE "notes" (
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
    "type" INTEGER NOT NULL DEFAULT 0
);
