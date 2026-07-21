-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "parentTweetId" INTEGER;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_parentTweetId_fkey" FOREIGN KEY ("parentTweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
