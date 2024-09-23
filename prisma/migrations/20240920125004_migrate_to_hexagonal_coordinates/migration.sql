/*
  Warnings:

  - You are about to drop the column `x` on the `Tile` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Tile` table. All the data in the column will be lost.
  - Added the required column `a` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `c` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `r` to the `Tile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "a" INTEGER NOT NULL,
    "r" INTEGER NOT NULL,
    "c" INTEGER NOT NULL,
    CONSTRAINT "Tile_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tile" ("boardId", "id") SELECT "boardId", "id" FROM "Tile";
DROP TABLE "Tile";
ALTER TABLE "new_Tile" RENAME TO "Tile";
CREATE UNIQUE INDEX "Tile_boardId_a_r_c_key" ON "Tile"("boardId", "a", "r", "c");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
