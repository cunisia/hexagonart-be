/*
  Warnings:

  - You are about to drop the `ColorTileEvent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Tile` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ColorTileEvent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ColorEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "r" INTEGER NOT NULL,
    "g" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    CONSTRAINT "ColorEvent_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ColorEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Board_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Board" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Board";
DROP TABLE "Board";
ALTER TABLE "new_Board" RENAME TO "Board";
CREATE TABLE "new_Tile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    CONSTRAINT "Tile_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tile" ("boardId", "id") SELECT "boardId", "id" FROM "Tile";
DROP TABLE "Tile";
ALTER TABLE "new_Tile" RENAME TO "Tile";
CREATE UNIQUE INDEX "Tile_boardId_x_y_key" ON "Tile"("boardId", "x", "y");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
