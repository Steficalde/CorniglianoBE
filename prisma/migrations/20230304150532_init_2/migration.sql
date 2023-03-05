/*
  Warnings:

  - You are about to drop the column `redeemedAt` on the `award_user` table. All the data in the column will be lost.
  - You are about to drop the column `purchasedAt` on the `purchases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "award_user" DROP COLUMN "redeemedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "purchasedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
