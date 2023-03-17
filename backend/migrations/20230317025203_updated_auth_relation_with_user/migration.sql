-- CreateTable
CREATE TABLE "_AuthorityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorityToUser_AB_unique" ON "_AuthorityToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorityToUser_B_index" ON "_AuthorityToUser"("B");

-- AddForeignKey
ALTER TABLE "_AuthorityToUser" ADD CONSTRAINT "_AuthorityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Authority"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorityToUser" ADD CONSTRAINT "_AuthorityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
