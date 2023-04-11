-- AlterTable
ALTER TABLE "Attendacne" ALTER COLUMN "deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "parentStoreId" TEXT;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_parentStoreId_fkey" FOREIGN KEY ("parentStoreId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
