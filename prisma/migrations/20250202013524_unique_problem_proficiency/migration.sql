/*
  Warnings:

  - A unique constraint covering the columns `[problem_id]` on the table `proficiencies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "proficiencies_problem_id_key" ON "proficiencies"("problem_id");
