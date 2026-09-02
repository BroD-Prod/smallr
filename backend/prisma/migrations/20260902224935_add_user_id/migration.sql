/*
  Warnings:

  - Added the required column `userId` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortCode" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "numOfCreatedUrls" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Url" ("clicks", "createdAt", "id", "originalUrl", "shortCode", "updatedAt") SELECT "clicks", "createdAt", "id", "originalUrl", "shortCode", "updatedAt" FROM "Url";
DROP TABLE "Url";
ALTER TABLE "new_Url" RENAME TO "Url";
CREATE UNIQUE INDEX "Url_originalUrl_key" ON "Url"("originalUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
