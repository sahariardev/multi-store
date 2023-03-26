-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Attendacne" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "attendanceDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(32) NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "deletedById" TEXT,

    CONSTRAINT "Attendacne_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendacne" ADD CONSTRAINT "Attendacne_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendacne" ADD CONSTRAINT "Attendacne_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendacne" ADD CONSTRAINT "Attendacne_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendacne" ADD CONSTRAINT "Attendacne_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
