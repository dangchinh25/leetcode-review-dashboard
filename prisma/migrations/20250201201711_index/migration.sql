-- CreateIndex
CREATE INDEX "problems_title_slug_idx" ON "problems"("title_slug");

-- CreateIndex
CREATE INDEX "problems_title_idx" ON "problems"("title");

-- CreateIndex
CREATE INDEX "proficiencies_problem_id_idx" ON "proficiencies"("problem_id");
