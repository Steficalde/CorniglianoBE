/*
  Warnings:

  - You are about to drop the column `name` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shops" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "googleId" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");
