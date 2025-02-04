/*
  Warnings:

  - You are about to drop the column `isTracking` on the `proficiencies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "proficiencies" DROP COLUMN "isTracking",
ADD COLUMN     "is_tracking" BOOLEAN NOT NULL DEFAULT true;
